"use client"
import {TooltipProvider } from "@/components/ui/tooltip"
import { CloudCog, FilePlus, FolderGit2, FolderPlus, FolderSync, LoaderCircle } from "lucide-react"
import * as React from "react"
import { TooltipButton } from "@/components/tooltip-button"
import useArticleStore from "@/stores/article"
import { open } from '@tauri-apps/plugin-shell';
import useSettingStore from "@/stores/setting"
import { useRouter } from "next/navigation";
import { RepoNames } from "@/lib/github.types"
import { useTranslations } from "next-intl"

export function FileToolbar() {
  const { newFolder, loadFileTree, newFile, fileTreeLoading } = useArticleStore()
  const { githubUsername, accessToken } = useSettingStore()
  const router = useRouter()
  const t = useTranslations('article.file.toolbar')

  async function openFolder() {
    open(`https://github.com/${githubUsername}/${RepoNames.sync}`)
  }

  function handleSetting() {
    router.push('/core/setting?anchor=sync', { scroll: false });
  }

  return (
    <div className="flex justify-between items-center h-12 border-b px-2">
      <div>
        {
          accessToken ? (
            <TooltipButton
              icon={fileTreeLoading ? <LoaderCircle className="animate-spin size-4" /> : <FolderGit2 />}
              tooltipText={fileTreeLoading ? t('loadingSync') : t('accessRepo')}
              disabled={githubUsername? false : true}
              onClick={openFolder}
            />
          ) : (
            <TooltipButton icon={<CloudCog className="text-red-800" />} tooltipText={t('configSync')} onClick={handleSetting} />
          )
        }
      </div>
      <div>
        <TooltipProvider>
          <TooltipButton icon={<FilePlus />} tooltipText={t('newArticle')} onClick={newFile} />
          <TooltipButton icon={<FolderPlus />} tooltipText={t('newFolder')} onClick={newFolder} />
          <TooltipButton icon={<FolderSync />} tooltipText={t('refresh')} onClick={loadFileTree} />
        </TooltipProvider>
      </div>
    </div>
  )
}
