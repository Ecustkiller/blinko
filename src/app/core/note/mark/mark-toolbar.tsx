"use client"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CopySlash, ImagePlus, ScanText } from "lucide-react"
import * as React from "react"
import { initMarksDb, insertMark } from "@/db/marks"
import { WebviewWindow, getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { invoke } from '@tauri-apps/api/core';
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import ocr from "@/lib/ocr"

function TooltipButton(
  { icon, tooltipText, onClick }:
  { icon: React.ReactNode; tooltipText: string; onClick?: () => void })
{
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function MarkToolbar() {
  const { currentTagId } = useTagStore()
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

    await webview.listen("save-success", async e => {
      if (typeof e.payload === 'string') {
        const content = await ocr(e.payload)
        await insertMark({ tagId: currentTagId, type: 'scan', content, url: e.payload })
        fetchMarks()
      }
    });
  }

  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <div className="flex justify-between items-center">
      <h1 className="font-bold flex items-center gap-1">Note</h1>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<ScanText />} tooltipText="屏幕截图" onClick={createScreenShot} />
          <TooltipButton icon={<CopySlash />} tooltipText="复制文本" />
          <TooltipButton icon={<ImagePlus />} tooltipText="插入图片" />
        </TooltipProvider>
      </div>
    </div>
  )
}
