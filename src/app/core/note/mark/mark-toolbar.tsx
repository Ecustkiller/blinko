"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { PanelRightClose } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"
import { ControlScan } from "./control-scan"
import { ControlText } from "./control-text"
import { ControlImage } from "./control-image"

export function MarkToolbar() {
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
          <ControlScan />
          <ControlImage />
          <ControlText />
        </TooltipProvider>
      </div>
    </div>
  )
}
