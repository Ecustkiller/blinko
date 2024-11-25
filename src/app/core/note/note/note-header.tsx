"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HardDriveDownload } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"
import { Separator } from "@/components/ui/separator"
import { LocaleSet } from './locale-set'
import { CountSet } from './count-set'
import { NoteSet } from './note-set'
import wordsCount from 'words-count';

export function NoteHeader({text}: {text: string}) {
  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <header className="h-12 flex items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <LocaleSet />
          <CountSet />
        </TooltipProvider>
      </div>
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <span className="text-sm px-2">{wordsCount(text)} 字符</span>
          <Separator orientation="vertical" />
          <span className="text-sm px-2">2024-11-21 04:10:15</span>
          <Separator orientation="vertical" />
          <NoteSet />
          <Separator orientation="vertical" />
          <TooltipButton icon={<HardDriveDownload />} tooltipText="生成文章" />
        </TooltipProvider>
      </div>
    </header>
  )
}
