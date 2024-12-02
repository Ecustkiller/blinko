import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import useArticleStore, { DirTree } from "@/stores/article";
import { BaseDirectory, remove, rename } from "@tauri-apps/plugin-fs";
import { File } from "lucide-react"
import { useRef, useState } from "react";

export function FileItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, setActiveFilePath, readArticle, loadFileTree, setCurrentArticle } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    readArticle(path)
  }

  async function handleDeleteFile() {
    await remove(`article/${path}`, { baseDir: BaseDirectory.AppData })
    await loadFileTree()
    setActiveFilePath('')
    setCurrentArticle('')
  }

  async function handleRename() {
    const name = inputRef.current?.value
    if (name) {
      await rename(`article/${item.name}`, `article/${name}` ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      await loadFileTree()
      setActiveFilePath(name)
    }
    setIsEditing(false)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuButton isActive={activeFilePath === path} onClick={handleSelectFile} onContextMenu={handleSelectFile}>
          <File />
          {
            isEditing ? 
            <Input
              ref={inputRef}
              className="h-6 rounded-sm"
              value={name}
              onBlur={handleRename}
              onChange={(e) => { setName(e.target.value) }}
            /> :
            <span>{item.name}</span>
          }
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset>
          查看原文件
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          剪切
        </ContextMenuItem>
        <ContextMenuItem inset>
          复制
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          粘贴
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={() => setIsEditing(true)}>
          重命名
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-900" onClick={handleDeleteFile}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}