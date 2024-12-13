import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import { decodeBase64ToString, getFileCommits, getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import useArticleStore from "@/stores/article";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { CloudUpload, LoaderCircle } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject, useState } from "react";

export default function Sync({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { activeFilePath, currentArticle } = useArticleStore()
  const [loading, setLoading] = useState(false)
  async function handleSync() {
    setLoading(true)
    mdRef.current?.focus()
    // 获取上一次提交的记录内容
    let message = `Upload ${activeFilePath}`
    const commits = await getFileCommits({ path: activeFilePath, repo: RepoNames.article })
    if (commits?.length > 0) {
      const lastCommit = commits[0]
      const latContent = await getFiles({path: `${activeFilePath}?ref=${lastCommit.sha}`, repo: RepoNames.article})
      const text = `
        对比两篇文章：
        ---
        本次修改后的文章：${currentArticle}
        ---
        上次提交文章：${decodeBase64ToString(latContent?.content || '')}
        ---
        对比后对本次修改返回一条标准的提交描述，仅返回描述内容，字数不能超过30个字。
      `
      message = (await fetchAi(text)).choices[0].message.content
    }
    const res = await getFiles({path: activeFilePath, repo: RepoNames.article})
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
      repo: RepoNames.article
    })
    if (uploadRes?.status === 200) {
      toast({title: '同步成功', description: uploadRes.data?.commit.message})
    }
    setLoading(false)
  }
  return (
    <TooltipButton
      icon={loading ? <LoaderCircle className="animate-spin size-4" /> : <CloudUpload />}
      tooltipText="同步"
      onClick={handleSync}
    >
    </TooltipButton>
  )
}