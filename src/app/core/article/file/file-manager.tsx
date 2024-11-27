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
import { readDir, BaseDirectory, DirEntry } from '@tauri-apps/plugin-fs';

interface DirTree extends DirEntry {
  children?: DirTree[]
  parent?: DirTree
}

export function FileManager() {
  const [tree, setTree] = useState<DirTree[]>([])

  async function read() {
    const cacheTree: DirTree[] = []
    const dirs = await readDir('article', { baseDir: BaseDirectory.AppData });
    cacheTree.push(...dirs.filter(file => file.name !== '.DS_Store'))
    for (let index = 0; index < cacheTree.length; index++) {
      const dir = cacheTree[index];
      if (dir.isDirectory) {
        const files = await readDir(`article/${dir.name}`, { baseDir: BaseDirectory.AppData });
        dir.children = files.filter(file => file.name !== '.DS_Store').map(file => ({ ...file, parent: dir }))
      }
    }
    setTree(cacheTree)
  }

  useEffect(() => {
    read()
  }, [])

  function Tree({ item }: { item: DirTree }) {
    function handleSelectFile() {
      console.log(item)
    }

    if (!item.children?.length) {
      return (
        <SidebarMenuButton
          isActive={item.name === "button.tsx"}
          className="data-[active=true]:bg-transparent"
          onClick={handleSelectFile}
        >
          <File />
          {item.name}
        </SidebarMenuButton>
      )
    }
    return (
      <SidebarMenuItem>
        <Collapsible
          className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
          defaultOpen={item.name === "components" || item.name === "ui"}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronRight className="transition-transform" />
              <Folder />
              {item.name}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((subItem, index) => (
                <Tree key={index} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {tree.map((item, index) => (
              <Tree key={index} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}