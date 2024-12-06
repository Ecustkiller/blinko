'use client'
import { LocalImage } from "@/components/local-image"
import { Button } from "@/components/ui/button"
import { invoke } from "@tauri-apps/api/core"
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { Check } from "lucide-react"
import React, { useEffect } from "react"
import { useState } from "react"
import ReactCrop, { type Crop } from 'react-image-crop'
import { register, isRegistered, unregister } from '@tauri-apps/plugin-global-shortcut';
import 'react-image-crop/dist/ReactCrop.css'

export default function Page() {

  const [crop, setCrop] = useState<Crop>()
  const [y, setY] = useState(0)
  const [scale, setScale] = useState(0)

  async function setScreen() {
    const innerPosition = await getCurrentWebviewWindow().innerPosition()
    const scaleFactor = await getCurrentWebviewWindow().scaleFactor()

    setY(innerPosition.y / scaleFactor)
    setScale(scaleFactor)
  }

  async function success() {
    const path = await invoke('screenshot_save', {
      x: (crop?.x || 0) * scale,
      y: ((crop?.y || 0) + y) * scale,
      width: (crop?.width || 0) * scale,
      height: (crop?.height || 0) * scale
    })
    await getCurrentWebviewWindow().emit('save-success', path)
    await getCurrentWebviewWindow().close()
  }

  async function initRegister() {
    const isEscRegistered = await isRegistered('Esc');
    if (isEscRegistered) {
      await unregister('Esc');
    }
    await register('Esc', async (e) => {
      if (e.state === 'Released') {
        const window = getCurrentWebviewWindow()
        await window.close()
      }
    });
  }

  useEffect(() => {
    initRegister()
  }, [])

  function Toolbar() {
    return (
      <>
        <Button className="absolute bottom-2 right-2" onClick={success} size="icon">
          <Check />
        </Button>
      </>
    )
  }
  
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ReactCrop crop={crop} onChange={c => setCrop(c)} ruleOfThirds={true} renderSelectionAddon={Toolbar}>
        <LocalImage onLoad={setScreen} className="w-screen" style={{ transform: `translateY(-${y}px)` }} src="/temp_screenshot.png" alt="" />
      </ReactCrop>
      <p className="fixed bottom-0 right-0 text-white grid gap-2 text-right py-1 px-4 overflow-hidden">
        <span>x: {crop?.x}</span>
        <span>y: {crop?.y}</span>
        <span>width: {crop?.width}{crop?.unit}</span>
        <span>height: {crop?.height}{crop?.unit}</span>
      </p>
    </div>
  )
}