'use client'

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import React from "react"
import { NoteManage } from './tag'
import { MarkToolbar } from './mark/mark-toolbar'
import { MarkList } from './mark/mark-list'

export function NoteSidebar() {
  return (
    <Sidebar collapsible="none" className="flex-1 md:flex border-r max-w-[280px]">
      <SidebarHeader className="border-b p-2">
        <MarkToolbar />
        <NoteManage/>
      </SidebarHeader>
      <MarkList />
    </Sidebar>
  )
}