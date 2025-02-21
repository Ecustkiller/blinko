import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import { decodeBase64ToString, getFileCommits, getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import useArticleStore from "@/stores/article";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { useEffect } from "react";
import { diffWordsWithSpace } from 'diff';
import Vditor from "vditor";
import emitter from "@/lib/emitter";
import { Store } from "@tauri-apps/plugin-store";

export default function Sync({editor}: {editor?: Vditor}) {
  const { currentArticle } = useArticleStore()

  async function handleSync() {
    editor?.focus();
    const store = await Store.load('store.json');
    const activeFilePath = await store.get<string>('activeFilePath') || ''
    const button = (editor?.vditor.toolbar?.elements?.sync.childNodes[0] as HTMLButtonElement)
    button.classList.add('vditor-menu--disabled')
    // 获取上一次提交的记录内容
    let message = `Upload ${activeFilePath}`
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
    if (uploadRes?.status === 200 || uploadRes?.status === 201) {
      if (uploadRes.data.content?.sha === sha) {
        toast({title: '内容未改变，无需提交', variant: 'destructive'})
      } else {
        toast({title: '同步成功', description: uploadRes.data?.commit.message})
      }
    }
    button.classList.remove('vditor-menu--disabled')
  }

  useEffect(() => {
    emitter.on('toolbar-sync', handleSync)
  }, [])

  return (
    <></>
  )
}