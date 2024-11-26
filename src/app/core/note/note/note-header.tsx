"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HardDriveDownload } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"
import { Separator } from "@/components/ui/separator"
import { LocaleSet } from './locale-set'
import { CountSet } from './count-set'
import { NoteHistory } from './note-history'
import wordsCount from 'words-count';
import useNoteStore from "@/stores/note"
import dayjs from "dayjs"

export function NoteHeader({text}: {text: string}) {
  const { currentNote } = useNoteStore()

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
          {
            currentNote?.createdAt ? 
            <div className="flex items-center h-6 gap-1">
              <span className="text-sm px-2">{wordsCount(text)} 字</span>
              <Separator orientation="vertical" />
              <time className="text-sm px-2" suppressHydrationWarning>{dayjs(currentNote?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</time>
              <Separator orientation="vertical" />
            </div> : null
          }
          <NoteHistory content={text} />
          <Separator orientation="vertical" />
          <TooltipButton icon={<HardDriveDownload />} tooltipText="生成文章" />
        </TooltipProvider>
      </div>
    </header>
  )
}
