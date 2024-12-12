'use client'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"
import { Folder } from "lucide-react"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import useArticleStore, { DirTree } from "@/stores/article"
import { Input } from "@/components/ui/input"
import { BaseDirectory, mkdir, rename } from "@tauri-apps/plugin-fs"
import { FileItem } from './file-item'
import { FolderItem } from "./folder-item"

function Tree({ item }: { item: DirTree }) {
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { loadFileTree, fileTree, collapsibleList, setCollapsibleList, loadCollapsibleFiles } = useArticleStore()

  function handleCollapse(isOpen: boolean) {
    setCollapsibleList(item.name, isOpen)
    if (isOpen) {
      loadCollapsibleFiles(item.name)
    }
  }

  async function handleMkdir() {
    if (name !== '' && !fileTree.map(item => item.name).includes(name)) {
      await mkdir(`article/${name}`, { baseDir: BaseDirectory.AppData })
    }
    loadFileTree()
  }

  useEffect(() => {
    if (item.isEditing) {
      inputRef.current?.focus()
      setName(item.name)
    }
  }, [item])

  return (
    item.isFile ? 
    <FileItem item={item} /> :
    <SidebarMenuItem>
      {
        item.isEditing ? 
        <div className="flex items-center gap-2 pl-2">
          <Folder size={18} />
          <Input
            ref={inputRef}
            className="h-6 rounded-sm"
            value={name}
            onBlur={handleMkdir}
            onChange={(e) => { setName(e.target.value) }}
          />
        </div> : 
        <Collapsible
          onOpenChange={handleCollapse}
          className="group/collapsible [&[data-state=open]>button>.file-manange-item>svg:first-child]:rotate-90"
          open={collapsibleList.includes(item.name)}
        >
          <FolderItem item={item} />
          <CollapsibleContent className="pl-1">
            <SidebarMenuSub>
              {item.children?.map((subItem) => (
                <Tree key={subItem.name} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      }
    </SidebarMenuItem>
  )
}

export function FileManager() {
  const [isDragging, setIsDragging] = useState(false)
  const { activeFilePath, fileTree, loadFileTree, setActiveFilePath } = useArticleStore()

  async function handleDrop (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const renamePath = e.dataTransfer?.getData('text')
    if (renamePath) {
      const filename = renamePath.slice(renamePath.lastIndexOf('/') + 1)
      const oldPaht = `article/${renamePath}`;
      const newPath = `article/${filename}`;
      await rename(oldPaht, newPath ,{ newPathBaseDir: BaseDirectory.AppData, oldPathBaseDir: BaseDirectory.AppData})
      loadFileTree()
      if (renamePath === activeFilePath) {
        setActiveFilePath(newPath.replace('article/', ''))
      }
    }
    setIsDragging(false)
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
    loadFileTree()
  }, [loadFileTree])

  return (
    <SidebarContent className={isDragging ? 'file-on-drop' : ''}>
      <SidebarGroup className="flex-1 p-0">
        <SidebarGroupContent className="flex-1">
          <SidebarMenu className="h-full">
            <div
              className="min-h-0.5"
              onDrop={(e) => handleDrop(e)}
              onDragOver={e => handleDragOver(e)}
              onDragLeave={(e) => handleDragleave(e)}
            >
            </div>
            {fileTree.map((item) => (
              <Tree key={item.name} item={item} />
            ))}
            <div
              className="flex-1 min-h-1"
              onDrop={(e) => handleDrop(e)}
              onDragOver={e => handleDragOver(e)}
              onDragLeave={(e) => handleDragleave(e)}
            >
            </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}