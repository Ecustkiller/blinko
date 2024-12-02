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
import { BaseDirectory, mkdir } from "@tauri-apps/plugin-fs"
import { FileItem } from './file-item'
import { FolderItem } from "./folder-item"

function Tree({ item }: { item: DirTree }) {
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { loadFileTree, fileTree, collapsibleList, setCollapsibleList } = useArticleStore()

  function handleCollapse(isOpen: boolean) {
    setCollapsibleList(item.name, isOpen)
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
          <CollapsibleContent>
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
  const { fileTree, loadFileTree } = useArticleStore()

  useEffect(() => {
    loadFileTree()
  }, [loadFileTree])

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {fileTree.map((item) => (
              <Tree key={item.name} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}