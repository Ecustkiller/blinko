'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormItem, SettingType } from "../components/setting-base"
import { FolderOpen } from "lucide-react"
import { useEffect, useState } from "react"
import useSettingStore from "@/stores/setting"
import { open } from '@tauri-apps/plugin-dialog'
import { BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs"
import { useTranslations } from 'next-intl'
import useArticleStore from "@/stores/article"

export function SettingFile() {
  const { workspacePath, setWorkspacePath } = useSettingStore()
  const [defaultPath, setDefaultPath] = useState('')
  const {clearCollapsibleList, loadFileTree, setActiveFilePath, setCurrentArticle} = useArticleStore()
  const t = useTranslations('settings.file')

  // 初始化默认工作区路径
  useEffect(() => {
    async function getDefaultPath() {
      const defaultWorkspace = `/article`
      setDefaultPath(defaultWorkspace)
    }
    getDefaultPath()
  }, [])

  // 选择工作区目录
  async function handleSelectWorkspace() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: t('workspace.select')
      })
      
      if (selected) {
        const path = selected as string
        await setWorkspacePath(path)
        await clearCollapsibleList()
        setActiveFilePath('')
        setCurrentArticle('')
        await loadFileTree()
      }
    } catch (error) {
      console.error('选择工作区失败:', error)
    }
  }

  // 重置为默认工作区
  async function handleResetWorkspace() {
    try {
      // 确保默认目录存在
      const exists1 = await exists('article', { baseDir: BaseDirectory.AppData })
      if (!exists1) {
        await mkdir('article', { baseDir: BaseDirectory.AppData })
      }
      await setWorkspacePath('')
      await clearCollapsibleList()
      setActiveFilePath('')
      setCurrentArticle('')
      await loadFileTree()
    } catch (error) {
      console.error('重置工作区失败:', error)
    }
  }

  return (
    <SettingType
      id="file"
      title={t('title')}
      icon={<FolderOpen className="w-5 h-5" />}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('workspace.title')}</CardTitle>
          <CardDescription>
            {t('workspace.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormItem 
            title={t('workspace.current')} 
            desc={workspacePath ? t('workspace.custom') : t('workspace.default')}
          >
            <div className="p-3 border rounded-md bg-muted/50 text-sm break-all">
              {workspacePath || defaultPath}
            </div>
          </FormItem>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button 
            onClick={handleSelectWorkspace}
          >
            {t('workspace.select')}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetWorkspace}
            disabled={!workspacePath}
          >
            {t('workspace.reset')}
          </Button>
        </CardFooter>
      </Card>
    </SettingType>
  )
}
