import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import { decodeBase64ToString, getFileCommits, getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import useArticleStore from "@/stores/article";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { diffWordsWithSpace } from 'diff';
import Vditor from "vditor";
import { Store } from "@tauri-apps/plugin-store";
import { Button } from "@/components/ui/button";
import useSettingStore from "@/stores/setting";
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import emitter from "@/lib/emitter";

export default function Sync({editor}: {editor?: Vditor}) {
  const { currentArticle } = useArticleStore()
  const { accessToken, autoSync } = useSettingStore()
  const [isLoading, setIsLoading] = useState(false)
  const syncTimeoutRef = useRef<number | null>(null)
  const [syncText, setSyncText] = useState('同步')

  async function handleSync() {
    if (isLoading || !accessToken) return;
    setIsLoading(true);
    try {
      editor?.focus();
      const store = await Store.load('store.json');
      const activeFilePath = await store.get<string>('activeFilePath') || ''
      // 获取上一次提交的记录内容
      let message = `Upload ${activeFilePath}`
      if (autoSync) {
        message += '（快速同步）'
      } else {
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
          message = await fetchAi(text)
        }
      }
      const res = await getFiles({path: activeFilePath, repo: RepoNames.sync})
      let sha = undefined
      if (res) {
        sha = res.sha
      }
      const filename = activeFilePath?.split('/').pop()
      const _path = activeFilePath?.split('/').slice(0, -1).join('/')
      const file = await readFile(`article/${activeFilePath}`, { baseDir: BaseDirectory.AppData  })
      const uploadRes = await uploadFile({
        ext: 'md',
        file: uint8ArrayToBase64(file),
        filename: `${_path && _path + '/'}${filename}`,
        sha,
        message,
        repo: RepoNames.sync
      })
      if (uploadRes?.data.commit.message) {
        setSyncText('同步成功')
        setTimeout(() => {
          setSyncText('同步')
        }, 2000)
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: '同步失败',
        description: '请检查网络连接或 GitHub 令牌',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!editor || !autoSync || !accessToken) return;
    
    const handleInput = () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      
      syncTimeoutRef.current = window.setTimeout(() => {
        handleSync();
      }, 10000);
    };
    
    emitter.on('editor-input', handleInput)
    
    return () => {
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      emitter.off('editor-input', handleInput)
    };
  }, [autoSync, accessToken]);

  return (
    <Button 
      onClick={handleSync} 
      variant="ghost" 
      disabled={!accessToken || isLoading}
      className="relative"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span className="text-xs text-muted-foreground">同步中</span>
        </>
      ) : (
        <span className="text-xs text-muted-foreground">{syncText}</span>
      )}
    </Button>
  )
}