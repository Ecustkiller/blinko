'use client'

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import React from "react"
import { TagManage } from './tag'
import { MarkToolbar } from './mark/mark-toolbar'
import { MarkList } from './mark/mark-list'
import useMarkStore from "@/stores/mark"

export function NoteSidebar() {
  const { trashState, marks } = useMarkStore()
  return (
    <Sidebar collapsible="none" className="border-r w-[280px]">
      <SidebarHeader className="p-0">
        <MarkToolbar />
        {
          trashState? 
          <p className="text-center text-xs text-zinc-500 pb-2 border-b">共 {marks.length} 条记录可还原</p> :
          <TagManage />
        }
      </SidebarHeader>
      <MarkList />
    </Sidebar>
  )
}