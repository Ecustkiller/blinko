import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, remove, rename, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
import { Cloud, CloudDownload, File } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { ask } from '@tauri-apps/plugin-dialog';
import { deleteFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import { cloneDeep } from "lodash-es";
export function FileItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(item.isEditing)
  const [name, setName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, setActiveFilePath, readArticle, setCurrentArticle, fileTree, setFileTree } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    readArticle(path, item.sha, item.isLocale)
  }

  async function handleDeleteFile() {
    await remove(`article/${path}`, { baseDir: BaseDirectory.AppData })
    const cacheTree = cloneDeep(fileTree)
    const index = cacheTree.findIndex(file => file.name === activeFilePath)
    cacheTree.splice(index, 1)
    setFileTree(cacheTree)
    setActiveFilePath('')
    setCurrentArticle('')
  }

  async function handleDeleteSyncFile() {
    const answer = await ask('确定是否将同步文件删除?', {
      title: 'NoteGen',
      kind: 'warning',
    });
    if (answer) {
      await deleteFile({ path: activeFilePath, sha: item.sha as string, repo: RepoNames.article })
      const cacheTree = cloneDeep(fileTree)
      const index = cacheTree.findIndex(file => file.name === activeFilePath)
      const currentFile = cacheTree[index]
      currentFile.sha = undefined;
      cacheTree.splice(index, 1, currentFile)
      setFileTree(cacheTree)
    }
  }

  async function handleStartRename() {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  async function handleRename() {
    // 将所有空格替换为下划线
    let name = inputRef.current?.value.replace(/ /g, '_')
    if (name && item.name && name !== item.name) {
      await rename(`article/${item.name}`, `article/${name}` ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      const cacheTree = cloneDeep(fileTree)
      const index = cacheTree.findIndex(file => file.name === item.name)
      if (index !== -1) {
        cacheTree.splice(index, 1, {
          name,
          parent: undefined,
          isEditing: false,
          isLocale: true,
          isDirectory: false,
          isFile: true,
          isSymlink: false
        })
        setFileTree(cacheTree)
      }
      setActiveFilePath(name)
    } else if (name) {
      if (!name.endsWith('.md')) name = name + '.md'
      await writeTextFile(`article/${name}`, '', { baseDir: BaseDirectory.AppData })
      const cacheTree = cloneDeep(fileTree)
      cacheTree.splice(0, 1, {
        name,
        parent: undefined,
        isEditing: false,
        isLocale: true,
        isDirectory: false,
        isFile: true,
        isSymlink: false
      })
      setFileTree(cacheTree)
      setActiveFilePath(name)
      setCurrentArticle('')
      setIsEditing(false)
    }
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
      setName(name)
      setTimeout(() => inputRef.current?.focus(), 300);
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
        <ContextMenuItem disabled={!item.sha} inset className="text-red-900" onClick={handleDeleteSyncFile}>
          删除同步文件
        </ContextMenuItem>
        <ContextMenuItem disabled={!item.isLocale} inset className="text-red-900" onClick={handleDeleteFile}>
          删除本地文件
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}