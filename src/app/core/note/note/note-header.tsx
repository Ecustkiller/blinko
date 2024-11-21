"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Clock, Globe, HardDriveDownload, PencilRuler, Save, Trash } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"
import { Separator } from "@/components/ui/separator"

export function NoteHeader({total = 0}) {
  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <header className="h-12 flex items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <TooltipButton icon={<Globe />} tooltipText="语言" />
          <TooltipButton icon={<PencilRuler />} tooltipText="字数" />
        </TooltipProvider>
      </div>
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <span className="text-sm px-2">{total} 字</span>
          <Separator orientation="vertical" />
          <span className="text-sm px-2">2024-11-21 04:10:15</span>
          <Separator orientation="vertical" />
          <TooltipButton icon={<Clock />} tooltipText="历史记录" />
          <TooltipButton icon={<Save />} tooltipText="保存记录" />
          <TooltipButton icon={<Trash />} tooltipText="删除记录" />
          <Separator orientation="vertical" />
          <TooltipButton icon={<HardDriveDownload />} tooltipText="生成文章" />
        </TooltipProvider>
      </div>
    </header>
  )
}
