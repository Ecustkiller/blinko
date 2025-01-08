import useArticleStore, { DirTree } from "@/stores/article";
import { Cloud, CloudOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function SyncState() {
  const { fileTree, activeFilePath } = useArticleStore()
  const [file, setFile] = useState<DirTree | null>(null)

  useEffect(() => {
    if (!fileTree) return
    if (activeFilePath.includes('/')) {
      const folderName = activeFilePath.split('/')[0]
      const folder = fileTree.find(item => item.name === folderName)
      if (folder) {
        const file = folder.children?.find(item => item.name === activeFilePath.split('/')[1])
        if (file) {
          setFile(file)
        }
      }
    } else {
      const file = fileTree.find(item => item.name === activeFilePath)
      if (file) {
        setFile(file)
      }
    }
  }, [activeFilePath, fileTree])

  return (
    <div className="flex items-center gap-1">
      {file?.sha ? <Cloud className="size-4" /> : <CloudOff className="size-4" />}
      <span>{file?.sha ? '已同步' : '未同步'}</span>
    </div>
  )
}