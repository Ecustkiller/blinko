import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, remove, rename } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
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

  async function handleStartRename() {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function handleRename() {
    const name = inputRef.current?.value
    if (name && name !== item.name) {
      await rename(`article/${item.name}`, `article/${name}` ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      await loadFileTree()
      setActiveFilePath(name)
    }
    setIsEditing(false)
  }

  async function handleShowFileManager() {
    const appDir = await appDataDir()
    invoke('show_in_folder', { path: `${appDir}/article/${path}` })
  }

  async function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
    ev.dataTransfer.setData('text', path)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={path === activeFilePath ? 'file-manange-item active' : 'file-manange-item'}
          onClick={handleSelectFile}
          onContextMenu={handleSelectFile}
          draggable
          onDragStart={handleDragStart}
        >
          <File className="size-4" />
          {
            isEditing ? 
            <Input
              ref={inputRef}
              className="h-6 rounded-sm"
              value={name}
              onBlur={handleRename}
              onChange={(e) => { setName(e.target.value) }}
            /> :
            <span className="select-none">{item.name}</span>
          }
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset onClick={handleShowFileManager}>
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
        <ContextMenuItem inset onClick={handleStartRename}>
          重命名
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-900" onClick={handleDeleteFile}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}