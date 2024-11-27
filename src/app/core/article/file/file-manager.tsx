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
import React, { useEffect } from "react"
import { Folder, File, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import useArticleStore, { DirTree } from "@/stores/article"

function Tree({ item }: { item: DirTree }) {

  const { activeFilePath, setActiveFilePath, readArticle, collapsibleList, setCollapsibleList } = useArticleStore()

  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    readArticle(path)
  }

  function handleCollapse(isOpen: boolean) {
    setCollapsibleList(item.name, isOpen)
  }

  if (!item.children?.length) {
    return (
      <SidebarMenuButton
        isActive={activeFilePath === path}
        className="data-[active=true]:bg-transparent"
        onClick={handleSelectFile}
      >
        <File />
        <span>{item.name}</span>
      </SidebarMenuButton>
    )
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        onOpenChange={handleCollapse}
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        open={collapsibleList.includes(item.name)}
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
            {item.children.map((subItem) => (
              <Tree key={subItem.name} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
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