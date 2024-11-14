"use client"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CopySlash, ImagePlus, ScanText } from "lucide-react"
import * as React from "react"

function TooltipButton({ icon, tooltipText }: { icon: React.ReactNode; tooltipText: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost">
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
  return (
    <div className="flex justify-between items-center">
      <h1 className="font-bold">Note</h1>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<ScanText />} tooltipText="屏幕截图" />
          <TooltipButton icon={<CopySlash />} tooltipText="复制文本" />
          <TooltipButton icon={<ImagePlus />} tooltipText="插入图片" />
        </TooltipProvider>
      </div>
    </div>
  )
}
