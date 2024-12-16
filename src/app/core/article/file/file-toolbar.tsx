"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { FilePlus, FolderOpen, FolderPlus, FolderSync } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"
import useArticleStore from "@/stores/article"
import { invoke } from "@tauri-apps/api/core"
import { appDataDir } from "@tauri-apps/api/path"

export function FileToolbar() {
  const { newFolder, loadFileTree, newFile, activeFilePath } = useArticleStore()

  async function openFolder() {
    const appDir = await appDataDir()
    invoke('show_in_folder', { path: `${appDir}/article/${activeFilePath}` })
  }

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <div>
        <TooltipButton icon={<FolderOpen />} tooltipText="本地仓库" disabled={!activeFilePath} onClick={openFolder} />
      </div>
      <div>
        <TooltipProvider>
          <TooltipButton icon={<FilePlus />} tooltipText="新建文章" onClick={newFile} />
          <TooltipButton icon={<FolderPlus />} tooltipText="新建文件夹" onClick={newFolder} />
          <TooltipButton icon={<FolderSync />} tooltipText="刷新" onClick={loadFileTree} />
        </TooltipProvider>
      </div>
    </div>
  )
}
