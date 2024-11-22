"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { ImagePlus, PanelRightClose, ScanText } from "lucide-react"
import * as React from "react"
import { initMarksDb, insertMark } from "@/db/marks"
import { WebviewWindow, getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { invoke } from '@tauri-apps/api/core';
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import ocr from "@/lib/ocr"
import { TooltipButton } from "@/components/tooltip-button"
import { ControlText } from "./control-text"

export function MarkToolbar() {
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function createScreenShot() {
    const currentWindow = getCurrentWebviewWindow()
    await currentWindow.hide()

    await invoke('screenshot')
    
    const webview = new WebviewWindow('screenshot', {
      url: '/screenshot',
      decorations: false,
      maximized: true,
    });

    webview.onCloseRequested(async () => {
      await currentWindow.show()
    })

    const unlisten = await webview.listen("save-success", async e => {
      if (typeof e.payload === 'string') {
        const content = await ocr(e.payload)
        await insertMark({ tagId: currentTagId, type: 'scan', content, url: e.payload })
        await fetchMarks()
        await fetchTags()
        getCurrentTag()
        unlisten()
      }
    });
  }

  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <h1 className="font-bold flex items-center gap-1">
        <TooltipButton icon={<PanelRightClose />} tooltipText="详细视图" />
      </h1>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<ScanText />} tooltipText="截图" onClick={createScreenShot} />
          <TooltipButton icon={<ImagePlus />} tooltipText="插图" />
          <ControlText />
        </TooltipProvider>
      </div>
    </div>
  )
}
