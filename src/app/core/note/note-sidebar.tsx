'use client'

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import React from "react"
import { TagManage } from './tag'
import { MarkToolbar } from './mark/mark-toolbar'
import { MarkList } from './mark/mark-list'

export function NoteSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r w-[280px]">
      <SidebarHeader className="p-0">
        <MarkToolbar />
        <TagManage />
      </SidebarHeader>
      <MarkList />
    </Sidebar>
  )
}