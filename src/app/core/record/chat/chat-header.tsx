"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import * as React from "react"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh'
import { Eraser } from "lucide-react"
import { TooltipButton } from "@/components/tooltip-button"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import { useTranslations } from 'next-intl'
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ModelSelect } from "./model-select"

dayjs.extend(relativeTime)
dayjs.locale(zh)

export function ChatHeader() {
  const { clearChats } = useChatStore()
  const { currentTagId } = useTagStore()
  const t = useTranslations()

  function clearHandler() {
    clearChats(currentTagId)
  }

  return (
    <header className="h-12 w-full grid grid-cols-3 items-center border-b gap-2 px-4">
      <div className="flex items-center h-6 gap-1">
        <LanguageSwitch />
      </div>
      <ModelSelect />
      <div className="flex justify-end items-center h-6 gap-1">
        <TooltipProvider>
          <TooltipButton icon={<Eraser />} tooltipText={t('record.chat.header.clearChat')} onClick={clearHandler}/>
        </TooltipProvider>
      </div>
    </header>
  )
}
