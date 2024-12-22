"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { FilePlus, FolderGit2, FolderPlus, FolderSync, LoaderCircle } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"
import useArticleStore from "@/stores/article"
import { open } from '@tauri-apps/plugin-shell';
import useSettingStore from "@/stores/setting"

export function FileToolbar() {
  const { newFolder, loadFileTree, newFile, fileTreeLoading } = useArticleStore()
  const { githubUsername } = useSettingStore()
  
  async function openFolder() {
    open(`https://github.com/${githubUsername}/note-gen-article-sync`)
  }

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <div>
        <TooltipButton
          icon={fileTreeLoading ? <LoaderCircle className="animate-spin size-4" /> : <FolderGit2 />}
          tooltipText={fileTreeLoading ? '正在加载同步信息' : '打开文件夹'}
          disabled={githubUsername? false : true}
          onClick={openFolder}
        />
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
