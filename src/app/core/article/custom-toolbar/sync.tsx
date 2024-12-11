import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import useArticleStore from "@/stores/article";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { CloudUpload, LoaderCircle } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject, useState } from "react";

export default function Sync({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { activeFilePath } = useArticleStore()
  const [loading, setLoading] = useState(false)
  async function handleSync() {
    setLoading(true)
    mdRef.current?.focus()
    const res = await getFiles({path: `article/${activeFilePath}`})
    let sha = undefined
    if (res) {
      sha = res.sha
    }
    const filename = activeFilePath?.split('/').pop()
    const _path = activeFilePath?.split('/').slice(0, -1).join('/')
    const file = await readFile(`article/${activeFilePath}`, { baseDir: BaseDirectory.AppData  })
    const uploadRes = await uploadFile({ path: `article${_path && '/' + _path}`, ext: 'md', file: uint8ArrayToBase64(file), filename, sha })
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