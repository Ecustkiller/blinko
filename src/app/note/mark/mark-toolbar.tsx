"use client"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CopySlash, ImagePlus, ScanText } from "lucide-react"
import * as React from "react"
import { initMarksDb, insertMark } from "@/db/marks"
import { Store } from '@tauri-apps/plugin-store';
import { Tag } from "@/db/tags"
import useMarkStore from "@/stores/mark"

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

  const { fetchMarks } = useMarkStore()

  async function addScreenShot() {
    const store = await Store.load('store.json');
    const currentTag = await store.get<Tag>('currentTag')
    const tagId = currentTag ? currentTag.id : 0
    await insertMark({ tagId, type: 'scan', content: "screenshot", url: '1731911113974.jpg' })
    fetchMarks()
  }

  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <div className="flex justify-between items-center">
      <h1 className="font-bold flex items-center gap-1">Note</h1>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<ScanText />} tooltipText="屏幕截图" onClick={addScreenShot} />
          <TooltipButton icon={<CopySlash />} tooltipText="复制文本" />
          <TooltipButton icon={<ImagePlus />} tooltipText="插入图片" />
        </TooltipProvider>
      </div>
    </div>
  )
}
