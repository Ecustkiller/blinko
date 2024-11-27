"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { FilePlus, FolderPlus, FolderSync } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"
import useArticleStore from "@/stores/article"

export function FileToolbar() {
  const { newFolder } = useArticleStore()
  function handleMkdir() {
    newFolder()
  }

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <div>
        <TooltipButton icon={<FilePlus />} tooltipText="新建文章" />
      </div>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<FolderPlus />} tooltipText="新建文件夹" onClick={handleMkdir} />
          <TooltipButton icon={<FolderSync />} tooltipText="刷新" />
        </TooltipProvider>
      </div>
    </div>
  )
}
