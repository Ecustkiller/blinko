"use client"

import * as React from "react"
import { Pin, PinOff } from "lucide-react"
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import { EmitterShortcutEvents } from "@/config/emitters"
import { Store } from "@tauri-apps/plugin-store";
import { ShortcutDefault, ShortcutSettings } from "@/config/shortcut";
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut";
import emitter from "@/lib/emitter";

export function PinToggle() {
  const t = useTranslations();
  const [isPin, setIsPin] = useState(false)

  async function setPin() {
    const store = await Store.load('store.json')
    const pin = await store.get<string>('pin')
    setIsPin(!pin)
    const window = getCurrentWindow()
    await window.setAlwaysOnTop(!pin)
    await store.set('pin', !pin)
  }

  async function initRegister() {
      const store = await Store.load('store.json')
      let lastKey = await store.get<string>(ShortcutSettings.pin)
      if (!lastKey) {
        await store.set(ShortcutSettings.pin, ShortcutDefault.pin)
        lastKey = ShortcutDefault.pin
      }
      const isEscRegistered = await isRegistered(lastKey);
      if (isEscRegistered) {
        await unregister(lastKey);
      }
      await register(lastKey, async (e) => {
        if (e.state === 'Pressed') {
          await setPin()
        }
      }).catch(() => {})
    }

  async function linstenRegister(key?: string) {
    if (!key) return
    const store = await Store.load('store.json')
    const lastKey = await store.get<string>(ShortcutSettings.pin)
    if (lastKey) {
      const isEscRegistered = await isRegistered(lastKey);
      if (isEscRegistered) {
        await unregister(lastKey);
      }
    }
    await store.set(ShortcutSettings.pin, key)
    await register(key, async (e) => {
      if (e.state === 'Pressed') {
        await setPin()
      }
    }).catch(() => {})
  }

  useEffect(() => {
    initRegister()
    emitter.on(EmitterShortcutEvents.pin, (res) => linstenRegister(res as string))
  }, [])


  return (
    <SidebarMenuButton asChild className="md:h-8 md:p-0"
      tooltip={{
        children: isPin ? t('common.unpin') : t('common.pin'),
        hidden: false,
      }}
    >
      <a href="#">
        <div className="flex size-8 items-center justify-center rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={setPin}
          >
            {
              isPin ?
                <Pin className="h-[1.2rem] w-[1.2rem]" /> :
                <PinOff className="h-[1.2rem] w-[1.2rem]" />
            }
          </Button>
        </div>
      </a>
    </SidebarMenuButton>
  )
}
