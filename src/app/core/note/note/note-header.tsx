"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { LocaleSet } from './locale-set'
import { CountSet } from './count-set'
import { NoteHistory } from './note-history'
import wordsCount from 'words-count';
import useNoteStore from "@/stores/note"
import dayjs from "dayjs"
import { NoteOutput } from "./note-output"
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh'

dayjs.extend(relativeTime)
dayjs.locale(zh)

export function NoteHeader({text}: {text: string}) {
  const { currentNote } = useNoteStore()
  return (
    <header className="h-12 w-full flex items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <LocaleSet />
          <CountSet />
        </TooltipProvider>
      </div>
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <div className="flex items-center h-6 gap-1">
            <span className="text-sm px-2">{wordsCount(text)} 字</span>
            <Separator orientation="vertical" />
            {
              currentNote?.createdAt ? 
              <>
                <time className="text-sm px-2" suppressHydrationWarning>{dayjs(currentNote?.createdAt).fromNow()}</time>
                <Separator orientation="vertical" />
              </> : null
            }
          </div>
          <NoteHistory />
          <NoteOutput />
        </TooltipProvider>
      </div>
    </header>
  )
}
