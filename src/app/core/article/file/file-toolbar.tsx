"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { FilePlus, FolderPlus, FolderSync, PanelRightClose } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"
import useArticleStore from "@/stores/article"

export function FileToolbar() {
  const { newFolder, loadFileTree, newFile } = useArticleStore()

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <div>
        <TooltipButton icon={<PanelRightClose />} tooltipText="详细视图" />
      </div>
      <div className="flex">
        <TooltipProvider>
          <TooltipButton icon={<FilePlus />} tooltipText="新建文章" onClick={newFile} />
          <TooltipButton icon={<FolderPlus />} tooltipText="新建文件夹" onClick={newFolder} />
          <TooltipButton icon={<FolderSync />} tooltipText="刷新" onClick={loadFileTree} />
        </TooltipProvider>
      </div>
    </div>
  )
}
