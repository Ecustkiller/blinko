'use client'

import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useTranslations } from 'next-intl'
import React from "react"
import { TagManage } from './tag'
import { MarkToolbar } from './mark/mark-toolbar'
import { MarkList } from './mark/mark-list'
import useMarkStore from "@/stores/mark"
import { Button } from "@/components/ui/button"
import { clearTrash } from "@/db/marks"
import { confirm } from '@tauri-apps/plugin-dialog';

export function NoteSidebar() {
  const t = useTranslations();
  const { trashState, marks, setMarks } = useMarkStore()

  async function handleClearTrash() {
    const res = await confirm(t('record.trash.confirm'), {
      title: t('record.trash.title'),
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
          <div className="flex pb-2 pl-2 relative border-b h-6 items-center justify-between">
            <p className="text-xs text-zinc-500">{t('record.trash.records', { count: marks.length })}</p>
            {
              marks.length > 0 ?
              <Button className="text-xs text-red-900" variant="link" onClick={handleClearTrash}>{t('record.trash.empty')}</Button> : null
            }
          </div> :
          <TagManage />
        }
      </SidebarHeader>
      <MarkList />
    </Sidebar>
  )
}