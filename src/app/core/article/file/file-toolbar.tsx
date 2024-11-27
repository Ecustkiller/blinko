"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { PanelRightClose } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"

export function FileToolbar() {

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <h1 className="font-bold flex items-center gap-1">
        <TooltipButton icon={<PanelRightClose />} tooltipText="详细视图" />
      </h1>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<PanelRightClose />} tooltipText="详细视图" />
        </TooltipProvider>
      </div>
    </div>
  )
}
