'use client'

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import React from "react"
import { FileToolbar } from "./file-toolbar"
import { FileManager } from "./file-manager"

export function FileSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r w-[280px]">
      <SidebarHeader className="p-0">
        <FileToolbar />
      </SidebarHeader>
      <FileManager />
    </Sidebar>
  )
}