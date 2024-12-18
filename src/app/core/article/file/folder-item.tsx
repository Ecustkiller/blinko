import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, mkdir, remove, rename } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
import { ChevronRight, Cloud, Folder, FolderDown } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { cloneDeep } from "lodash-es";

export function FolderItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(item.isEditing)
  const [name, setName] = useState(item.name)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, loadFileTree, setActiveFilePath, collapsibleList, setCollapsibleList, fileTree, setFileTree } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  async function handleDeleteFolder(evnet: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    evnet.stopPropagation()
    try {
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
    const name = inputRef.current?.value.replace(/ /g, '_')
    if (name && item.name && name !== item.name) {
      if (name && name !== item.name) {
        await loadFileTree()
      }
      await rename(`article/${item.name}`, `article/${name}`, { newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData })
      const cacheTree = cloneDeep(fileTree)
      const index = cacheTree.findIndex(file => file.name === item.name)
      if (index !== -1) {
        cacheTree.splice(index, 1, {
          name,
          parent: undefined,
          isEditing: false,
          isLocale: true,
          isDirectory: true,
          isFile: false,
          isSymlink: false
        })
        setFileTree(cacheTree)
      }
    } else if (name && !fileTree.map(item => item.name).includes(name)) {
      await mkdir(`article/${name}`, { baseDir: BaseDirectory.AppData })
      const cacheTree = cloneDeep(fileTree)
      cacheTree.splice(0, 1, {
        name,
        parent: undefined,
        isEditing: false,
        isLocale: true,
        isDirectory: true,
        isFile: false,
        isSymlink: false
      })
      setFileTree(cacheTree)
    }
    setIsEditing(false)
  }

  async function handleShowFileManager() {
    const appDir = await appDataDir()
    invoke('show_in_folder', { path: `${appDir}/article/${path}` })
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const renamePath = e.dataTransfer?.getData('text')
    if (renamePath) {
      const filename = renamePath.slice(renamePath.lastIndexOf('/') + 1)
      const oldPaht = `article/${renamePath}`;
      const newPath = `article/${path}/${filename}`;
      await rename(oldPaht, newPath, { newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData })
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

  useEffect(() => {
    if (item.isEditing) {
      setName(name)
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [item])

  return (
    <CollapsibleTrigger className="w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className={`${isDragging ? 'file-on-drop' : ''} file-manange-item flex`}>
            <ChevronRight className="transition-transform size-4 ml-1" />
            {
              isEditing ?
                <>
                  {
                    item.isLocale ?
                      <Folder className="size-4" /> :
                      <FolderDown className="size-4" />
                  }
                  <Input
                    ref={inputRef}
                    className="h-5 rounded-sm text-xs px-1 font-normal flex-1 mr-1"
                    value={name}
                    onBlur={handleRename}
                    onChange={(e) => { setName(e.target.value) }}
                    onKeyDown={(e) => {
                      if (e.code === 'Enter') {
                        handleRename()
                      }
                    }}
                  />
                </> :
                <div
                  onDrop={(e) => handleDrop(e)}
                  onDragOver={e => handleDragOver(e)}
                  onDragLeave={(e) => handleDragleave(e)}
                  className={`${item.isLocale ? '' : 'opacity-50'} flex gap-1 items-center flex-1`}
                >
                  {
                    item.isLocale ?
                      <Folder className="size-4" /> :
                      <FolderDown className="size-4" />
                  }
                  <span className="select-none text-xs line-clamp-1">{item.name}</span>
                </div>
            }
            {item.sha && item.isLocale && <Cloud className="size-3 mr-2 opacity-30" />}
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