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
import { Button } from "@/components/ui/button"
import { clearTrash } from "@/db/marks"
import { confirm } from '@tauri-apps/plugin-dialog';

export function NoteSidebar() {
  const { trashState, marks, setMarks } = useMarkStore()

  async function handleClearTrash() {
    const res = await confirm('确定清空回收站吗？', {
      title: '清空回收站',
      kind: 'warning',
    })
    if (res) {
      await clearTrash()
      setMarks([])
    }
  }

  return (
    <Sidebar collapsible="none" className="border-r w-[280px]">
      <SidebarHeader className="p-0">
        <MarkToolbar />
        {
          trashState? 
          <div className="flex pb-2 relative border-b h-6 items-center justify-center">
            <p className="absolute text-xs text-zinc-500">共 {marks.length} 条记录可还原</p>
            {
              marks.length > 0 ?
              <Button className="text-xs text-red-900 right-8 absolute" variant="link" onClick={handleClearTrash}>清空</Button> : null
            }
          </div> :
          <TagManage />
        }
      </SidebarHeader>
      <MarkList />
    </Sidebar>
  )
}