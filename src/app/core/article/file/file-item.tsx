import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, remove, rename, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
import { Cloud, CloudDownload, File } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { ask } from '@tauri-apps/plugin-dialog';
export function FileItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(item.isEditing)
  const [name, setName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, setActiveFilePath, readArticle, loadFileTree, setCurrentArticle } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    setCurrentArticle('')
    readArticle(path, item.sha, item.isLocale)
  }

  async function handleDeleteFile() {
    if (item.sha) {
      const answer = await ask('This action cannot be reverted. Are you sure?', {
        title: 'Tauri',
        kind: 'warning',
      });
      console.log(answer);
    }
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
    let name = inputRef.current?.value.replace(' ', '_')
    if (name && name !== item.name && item.name) {
      await rename(`article/${item.name}`, `article/${name}` ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      setActiveFilePath(name)
    } else if (name) {
      name = `article/${name}`
      if (!name.endsWith('.md')) name = name + '.md'
      writeTextFile(name, '', { baseDir: BaseDirectory.AppData })
      setActiveFilePath(name)
    }
    await loadFileTree()
    setIsEditing(false)
  }

  async function handleShowFileManager() {
    const appDir = await appDataDir()
    invoke('show_in_folder', { path: `${appDir}/article/${path}` })
  }

  async function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
    ev.dataTransfer.setData('text', path)
  }

  useEffect(() => {
    if (item.isEditing) {
      inputRef.current?.focus()
      setName(item.name)
    }
  }, [item])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={path === activeFilePath ? 'file-manange-item active' : 'file-manange-item'}
          onClick={handleSelectFile}
          onContextMenu={handleSelectFile}
        >
          {
            isEditing ? 
            <div className="flex gap-1 items-center w-full">
              <span className={item.parent ? 'size-0' : 'size-4 ml-1'} />
              <File className="size-4" />
              <Input
                ref={inputRef}
                className="h-5 rounded-sm text-xs px-1 font-normal flex-1 mr-1"
                value={name}
                onBlur={handleRename}
                onChange={(e) => { setName(e.target.value) }}
              />
            </div> :
            <span draggable onDragStart={handleDragStart}
              className={`${item.isLocale ? '' : 'opacity-50'} flex justify-between flex-1 select-none items-center gap-1 dark:hover:text-white`}>
              <div className="flex flex-1 gap-1 select-none">
                <span className={item.parent ? 'size-0' : 'size-4 ml-1'} />
                {
                  item.isLocale ? 
                    <File className="size-4" /> :
                    <CloudDownload className="size-4" />
                }
                <span className="text-xs flex-1 line-clamp-1">{item.name.slice(0, -3)}</span>
              </div>
              { item.sha && item.isLocale && <Cloud className="size-3 mr-2 opacity-30" /> } 
            </span>
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
        <ContextMenuItem disabled={!item.isLocale} inset onClick={handleStartRename}>
          重命名
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-900" onClick={handleDeleteFile}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}