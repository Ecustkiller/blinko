import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import { decodeBase64ToString, getFileCommits, getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import useArticleStore from "@/stores/article";
import { readFile } from "@tauri-apps/plugin-fs";
import { diffWordsWithSpace } from 'diff';
import Vditor from "vditor";
import { Store } from "@tauri-apps/plugin-store";
import { Button } from "@/components/ui/button";
import useSettingStore from "@/stores/setting";
import { useEffect, useState, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import emitter from "@/lib/emitter";
import { getFilePathOptions } from "@/lib/workspace";
import { useTranslations } from "next-intl";

export default function Sync({editor}: {editor?: Vditor}) {
  const { currentArticle } = useArticleStore()
  const { accessToken, autoSync, apiKey } = useSettingStore()
  const [isLoading, setIsLoading] = useState(false)
  const syncTimeoutRef = useRef<number | null>(null)
  const t = useTranslations('article.footer.sync')
  const [syncText, setSyncText] = useState(t('sync'))

  async function handleSync() {
    if (isLoading || !accessToken) return;
    setIsLoading(true);
    try {
      editor?.focus();
      const store = await Store.load('store.json');
      const activeFilePath = await store.get<string>('activeFilePath') || ''
      // 获取上一次提交的记录内容
      let message = `Upload ${activeFilePath}`
      if (apiKey) {
        const commits = await getFileCommits({ path: activeFilePath, repo: RepoNames.sync })
        if (commits?.length > 0) {
          const lastCommit = commits[0]
          const latContent = await getFiles({path: `${activeFilePath}?ref=${lastCommit.sha}`, repo: RepoNames.sync})
          const diff = diffWordsWithSpace(decodeBase64ToString(latContent?.content || ''), currentArticle)
          const addDiff = diff.filter(item => item.added).map(item => item.value).join('')
          const removeDiff = diff.filter(item => item.removed).map(item => item.value).join('')
          const text = `
            根据两篇内容的diff：
            增加了内容：${addDiff}
            删除了内容：${removeDiff}
            对比后对本次修改返回一条标准的提交描述，仅返回描述内容，字数不能超过50个字。
          `
          const aiMessage = await fetchAi(text)
          if (!aiMessage.includes('请求失败')) {
            message = aiMessage
          }
        }
      }
      const res = await getFiles({path: activeFilePath, repo: RepoNames.sync})
      let sha = undefined
      if (res) {
        sha = res.sha
      }
      const filename = activeFilePath?.split('/').pop()
      const _path = activeFilePath?.split('/').slice(0, -1).join('/')
      // 获取文件路径选项，根据是否有自定义工作区决定使用哪种路径方式
      const filePathOptions = await getFilePathOptions(activeFilePath)
      const file = await readFile(filePathOptions.path, filePathOptions.baseDir ? { baseDir: filePathOptions.baseDir } : undefined)
      const uploadRes = await uploadFile({
        ext: 'md',
        file: uint8ArrayToBase64(file),
        filename: `${_path && _path + '/'}${filename}`,
        sha,
        message,
        repo: RepoNames.sync
      })
      if (uploadRes?.data.commit.message) {
        setSyncText('已同步')
        emitter.emit('sync-success')
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: t('syncFailed'),
        description: t('checkNetworkOrToken'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAutoSync() {
    if (isLoading || !accessToken) return;
    setIsLoading(true);
    try {
      editor?.focus();
      const store = await Store.load('store.json');
      const activeFilePath = await store.get<string>('activeFilePath') || ''
      // 获取上一次提交的记录内容
      const message = `Upload ${activeFilePath}（${t('quickSync')}）`
      const res = await getFiles({path: activeFilePath, repo: RepoNames.sync})
      let sha = undefined
      if (res) {
        sha = res.sha
      }
      const filename = activeFilePath?.split('/').pop()
      const _path = activeFilePath?.split('/').slice(0, -1).join('/')
      // 获取文件路径选项，根据是否有自定义工作区决定使用哪种路径方式
      const filePathOptions = await getFilePathOptions(activeFilePath)
      const file = await readFile(filePathOptions.path, filePathOptions.baseDir ? { baseDir: filePathOptions.baseDir } : undefined)
      const uploadRes = await uploadFile({
        ext: 'md',
        file: uint8ArrayToBase64(file),
        filename: `${_path && _path + '/'}${filename}`,
        sha,
        message,
        repo: RepoNames.sync
      })
      if (uploadRes?.data.commit.message) {
        setSyncText('已同步')
        emitter.emit('sync-success')
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: t('syncFailed'),
        description: t('checkNetworkOrToken'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!editor || !autoSync || !accessToken) return;
    
    const handleInput = () => {
      if (syncText !== t('sync')) {
        setSyncText(t('sync'))
      }
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = window.setTimeout(() => {
        handleAutoSync();
      }, 10000);
    };
    
    emitter.on('editor-input', handleInput)
    
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      emitter.off('editor-input', handleInput)
    };
  }, [autoSync, accessToken, syncText]);

  return (
    <Button 
      onClick={handleSync}
      variant="ghost"
      size="sm"
      disabled={!accessToken || isLoading}
      className="relative outline-none"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span className="text-xs">{t('syncing')}</span>
        </>
      ) : (
        <>
          <Upload className="!size-3" />
          <span className="text-xs">{syncText}</span>
        </>
      )}
    </Button>
  )
}