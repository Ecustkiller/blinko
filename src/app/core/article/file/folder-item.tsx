import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, remove, rename } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
import { ChevronRight, Folder } from "lucide-react"
import { useRef, useState } from "react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

export function FolderItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, loadFileTree, setActiveFilePath, collapsibleList, setCollapsibleList } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  async function handleDeleteFolder(evnet: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    evnet.stopPropagation()
    try{
      await remove(`article/${path}`, { baseDir: BaseDirectory.AppData })
      await loadFileTree()
    } catch {
      toast({
        title: '删除失败',
        description: '文件夹内存在文件！',
        variant: 'destructive',
      })
    }
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
    }
    setIsEditing(false)
  }

  async function handleShowFileManager() {
    const appDir = await appDataDir()
    invoke('show_in_folder', { path: `${appDir}/article/${path}` })
  }

  async function handleDrop (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const renamePath = e.dataTransfer?.getData('text')
    if (renamePath) {
      const filename = renamePath.slice(renamePath.lastIndexOf('/') + 1)
      const oldPaht = `article/${renamePath}`;
      const newPath = `article/${path}/${filename}`;
      await rename(oldPaht, newPath ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      loadFileTree()
      if (renamePath === activeFilePath && !collapsibleList.includes(item.name)) {
        setCollapsibleList(item.name, true)
        setActiveFilePath(newPath.replace('article/', ''))
      }
    }
  }
  
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true)
  }

  function handleDragleave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false)
  }

  return (
    <CollapsibleTrigger className="w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={isDragging ? 'file-manange-item file-on-drop' : 'file-manange-item'}
            onDrop={(e) => handleDrop(e)}
            onDragOver={e => handleDragOver(e)}
            onDragLeave={(e) => handleDragleave(e)}
          >
            <ChevronRight className="transition-transform size-4" />
            <Folder className="size-4" />
            {
              isEditing ? 
              <Input
                ref={inputRef}
                className="h-6 rounded-sm"
                value={name}
                onBlur={handleRename}
                onChange={(e) => { setName(e.target.value) }}
              /> :
              <span className="select-none line-clamp-1">{item.name}</span>
            }
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset onClick={handleShowFileManager}>
            查看
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
          <ContextMenuItem inset className="text-red-900" onClick={(e) => { handleDeleteFolder(e); }}>
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </CollapsibleTrigger>
  )
}