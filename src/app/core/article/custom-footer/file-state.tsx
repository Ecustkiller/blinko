import { convertBytesToSize } from "@/lib/utils";
import useArticleStore from "@/stores/article";
import { BaseDirectory, exists, FileInfo, stat } from '@tauri-apps/plugin-fs'
import dayjs from "dayjs";
import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function FileState() {
  const { activeFilePath, currentArticle } = useArticleStore()
  const [fileState, setFileState] = useState<FileInfo | null>(null)

  async function getFileState() {
    if (!activeFilePath) return
    const path = `article/${activeFilePath}`
    const isExists = await exists(path, { baseDir: BaseDirectory.AppData })
    if (!isExists) return
    const state = await stat(path, { baseDir: BaseDirectory.AppData })
    setFileState(state)
  }

  useEffect(() => {
    getFileState()
    const interval = setInterval(() => {
      getFileState()
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [activeFilePath, currentArticle])
  
  return (
    <div className="flex items-center gap-4">
      {fileState?.mtime && 
        <div className="flex items-center gap-1">
          <SaveIcon className="size-3.5" />
          <span className="h-3.5">
            {dayjs(fileState?.mtime).fromNow()}
          </span>
        </div>
      }
      <span className="h-3.5">{convertBytesToSize(fileState?.size || 0)}</span>
    </div>
  )
}