"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"

export function NoteHeader() {
  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <header className="h-12 flex items-center justify-between gap-2 border-b px-4">
      <h1 className="font-bold flex items-center gap-1">Note</h1>
      <div className="flex items-center h-6 gap-2">
        <TooltipProvider>
          <TooltipButton icon={<HelpCircle />} tooltipText="帮助" />
        </TooltipProvider>
      </div>
    </header>
  )
}
