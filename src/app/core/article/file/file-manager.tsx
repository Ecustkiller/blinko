'use client'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"
import { Folder, File, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import useArticleStore, { DirTree } from "@/stores/article"
import { Input } from "@/components/ui/input"
import { BaseDirectory, mkdir } from "@tauri-apps/plugin-fs"

function Tree({ item }: { item: DirTree }) {
  const [name, setName] = useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { activeFilePath, setActiveFilePath, loadFileTree, fileTree, readArticle, collapsibleList, setCollapsibleList } = useArticleStore()

  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    readArticle(path)
  }

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

  if (item.isFile) {
    return (
      <SidebarMenuButton
        isActive={activeFilePath === path}
        onClick={handleSelectFile}
      >
        <File />
        <span>{item.name}</span>
      </SidebarMenuButton>
    )
  }
  return (
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
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          open={collapsibleList.includes(item.name)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronRight className="transition-transform" />
              <Folder />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
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