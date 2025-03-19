import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import useArticleStore, { DirTree } from "@/stores/article";
import { BaseDirectory, exists, readTextFile, remove, rename, writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir } from '@tauri-apps/api/path';
import { Cloud, CloudDownload, File } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { ask } from '@tauri-apps/plugin-dialog';
import { deleteFile } from "@/lib/github";
import { RepoNames } from "@/lib/github.types";
import { cloneDeep } from "lodash-es";
import { open } from "@tauri-apps/plugin-shell";
import { computedParentPath, getCurrentFolder } from "@/lib/path";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import useClipboardStore from "@/stores/clipboard";

export function FileItem({ item }: { item: DirTree }) {
  const [isEditing, setIsEditing] = useState(item.isEditing)
  const [name, setName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const { activeFilePath, setActiveFilePath, readArticle, setCurrentArticle, fileTree, setFileTree, loadFileTree } = useArticleStore()
  const { setClipboardItem, clipboardItem, clipboardOperation } = useClipboardStore()
  const t = useTranslations('article.file')
  
  const path = computedParentPath(item)
  const isRoot = path.split('/').length === 1
  const folderPath = path.includes('/') ? path.split('/').slice(0, -1).join('/') : ''
  const cacheTree = cloneDeep(fileTree)
  const currentFolder = getCurrentFolder(folderPath, cacheTree)

  function handleSelectFile() {
    setActiveFilePath(computedParentPath(item))
    readArticle(computedParentPath(item), item.sha, item.isLocale)
  }

  async function handleDeleteFile() {
    await remove(`article/${path}`, { baseDir: BaseDirectory.AppData })
    if (currentFolder) {
      const index = currentFolder.children?.findIndex(file => file.name === item.name)
      if (index !== undefined && index !== -1 && currentFolder.children) {
        const current = currentFolder.children[index]
        if (current.sha) {
          current.isLocale = false
        } else {
          currentFolder.children.splice(index, 1)
        }
      }
    } else {
      const index = cacheTree.findIndex(file => file.name === item.name)
      if (index !== undefined && index !== -1) {
        const current = cacheTree[index]
        if (current.sha) {
          current.isLocale = false
        } else {
          cacheTree.splice(index, 1)
        }
      }
    }
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
      await deleteFile({ path: activeFilePath, sha: item.sha as string, repo: RepoNames.sync })
      const index = currentFolder?.children?.findIndex(file => file.name === item.name)
      if (index !== undefined && index !== -1 && currentFolder?.children) {
        currentFolder.children[index].sha = ''
      }
      setFileTree(cacheTree)
    }
  }

  async function handleStartRename() {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  async function handleRename() {
    setName(name.replace(/ /g, '_')) // github 存储空格会报错，替换为下划线
    if (name && name !== item.name) {
      if (currentFolder && currentFolder.children) {
        const fileIndex = currentFolder?.children?.findIndex(file => file.name === item.name)
        if (fileIndex !== undefined && fileIndex !== -1) {
          currentFolder.children[fileIndex].name = name
          currentFolder.children[fileIndex].isEditing = false
        }
      } else {
        const fileIndex = cacheTree.findIndex(file => file.name === item.name)
        cacheTree[fileIndex].name = name
        cacheTree[fileIndex].isEditing = false
      }
      const oldPath = `article/${path}` 
      const newPath = `article/${path.split('/').slice(0, -1).join('/')}/${name}`
      if (newPath.includes('.md')) {
        await rename(oldPath, newPath, { newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData })
      } else {
        const isExists = await exists(newPath + '.md', { baseDir: BaseDirectory.AppData })
        if (isExists) {
          toast({ title: '文件名已存在' })
          setTimeout(() => inputRef.current?.focus(), 300);
          return
        } else {
          await writeTextFile(newPath + '.md', '', { baseDir: BaseDirectory.AppData })
        }
      }
      setActiveFilePath(newPath.replace('article/', ''))
    } else {
      if (currentFolder && currentFolder.children) {
        const index = currentFolder?.children?.findIndex(item => item.name === '')
        if (index !== undefined && index !== -1 && currentFolder?.children) {
          currentFolder?.children?.splice(index, 1)
        }
      } else {
        const index = cacheTree.findIndex(item => item.name === '')
        cacheTree.splice(index, 1)
      }
    }
    setFileTree(cacheTree)
    setIsEditing(false)
  }

  async function handleShowFileManager() {
    const appDir = await appDataDir()
    open(`${appDir}/article${item.parent? '/'+item.parent.name : ''}`)
  }

  async function handleDragStart(ev: React.DragEvent<HTMLDivElement>) {
    ev.dataTransfer.setData('text', path)
  }

  async function handleCopyFile() {
    setClipboardItem({
      path,
      name: item.name,
      isDirectory: false,
      sha: item.sha,
      isLocale: item.isLocale
    }, 'copy')
    toast({ title: t('clipboard.copied') })
  }

  async function handleCutFile() {
    setClipboardItem({
      path,
      name: item.name,
      isDirectory: false,
      sha: item.sha,
      isLocale: item.isLocale
    }, 'cut')
    toast({ title: t('clipboard.cut') })
  }

  async function handlePasteFile() {
    if (!clipboardItem) {
      toast({ title: t('clipboard.empty'), variant: 'destructive' })
      return
    }

    // This function only handles file paste operations
    if (clipboardItem.isDirectory) {
      toast({ title: t('clipboard.notSupported'), variant: 'destructive' })
      return
    }

    try {
      const sourcePath = `article/${clipboardItem.path}`
      const targetDir = path.substring(0, path.lastIndexOf('/'))
      const targetPath = `article/${targetDir}/${clipboardItem.name}`
      
      // Check if file already exists at target location
      const fileExists = await exists(targetPath, { baseDir: BaseDirectory.AppData })
      if (fileExists) {
        const confirmOverwrite = await ask(t('clipboard.confirmOverwrite'), {
          title: 'NoteGen',
          kind: 'warning',
        })
        if (!confirmOverwrite) return
      }

      // Read content from source file
      const content = await readTextFile(sourcePath, { baseDir: BaseDirectory.AppData })
      
      // Write to target location
      await writeTextFile(targetPath, content, { baseDir: BaseDirectory.AppData })
      
      // If cut operation, delete the original file
      if (clipboardOperation === 'cut') {
        await remove(sourcePath, { baseDir: BaseDirectory.AppData })
        // Clear clipboard after cut & paste operation
        setClipboardItem(null, 'none')
      }

      // Refresh file tree
      loadFileTree()
      toast({ title: t('clipboard.pasted') })
    } catch (error) {
      console.error('Paste operation failed:', error)
      toast({ title: t('clipboard.pasteFailed'), variant: 'destructive' })
    }
  }

  async function handleEditEnd() {
    if (currentFolder && currentFolder.children) {
      const index = currentFolder?.children?.findIndex(item => item.name === '')
      if (index !== undefined && index !== -1 && currentFolder?.children) {
        currentFolder?.children?.splice(index, 1)
      }
    } else {
      const index = cacheTree.findIndex(item => item.name === '')
      if (index !== -1) {
        cacheTree.splice(index, 1)
      }
    }
    setFileTree(cacheTree)
    setIsEditing(false)
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
          className={`${path === activeFilePath ? 'file-manange-item active' : 'file-manange-item'} ${isRoot && '-translate-x-5'}`}
          onClick={handleSelectFile}
          onContextMenu={handleSelectFile}
        >
          {
            isEditing ? 
            <div className="flex gap-1 items-center w-full select-none">
              <span className={item.parent ? 'size-0' : 'size-4 ml-1'} />
              <File className="size-4" />
              <Input
                ref={inputRef}
                className="h-5 rounded-sm text-xs px-1 font-normal flex-1 mr-1"
                value={name}
                onBlur={handleRename}
                onChange={(e) => { setName(e.target.value) }}
                onKeyDown={(e) => {
                  if (e.code === 'Enter') {
                    handleRename()
                  } else if (e.code === 'Escape') {
                    handleEditEnd()
                  }
                }}
              />
            </div> :
            <span draggable onDragStart={handleDragStart}
              className={`${item.isLocale ? '' : 'opacity-50'} flex justify-between flex-1 select-none items-center gap-1 dark:hover:text-white`}>
              <div className="flex flex-1 gap-1 select-none relative">
                <span className={item.parent ? 'size-0' : 'size-4 ml-1'}></span>
                <div className="relative">
                  { item.isLocale ? <File className="size-4" /> : <CloudDownload className="size-4" /> }
                  { item.sha && item.isLocale && <Cloud className="size-2.5 absolute left-0 bottom-0 z-10 bg-primary-foreground" /> }
                </div>
                <span className="text-xs flex-1 line-clamp-1">{item.name}</span>
              </div> 
            </span>
          }
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset onClick={handleShowFileManager}>
          {t('context.viewDirectory')}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset disabled={!item.isLocale} onClick={handleCutFile}>
          {t('context.cut')}
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleCopyFile}>
          {t('context.copy')}
        </ContextMenuItem>
        <ContextMenuItem inset disabled={!clipboardItem} onClick={handlePasteFile}>
          {t('context.paste')}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={!item.isLocale} inset onClick={handleStartRename}>
          {t('context.rename')}
        </ContextMenuItem>
        <ContextMenuItem disabled={!item.sha} inset className="text-red-900" onClick={handleDeleteSyncFile}>
          {t('context.deleteSyncFile')}
        </ContextMenuItem>
        <ContextMenuItem disabled={!item.isLocale} inset className="text-red-900" onClick={handleDeleteFile}>
          {t('context.deleteLocalFile')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}