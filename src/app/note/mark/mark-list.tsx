'use client'

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import React, { useEffect } from "react"
import { getMarks, type Marks } from "@/db/marks"
import { Store } from '@tauri-apps/plugin-store';
import { Tag } from "@/db/tags";
import emitter from "@/Emitter";
import { MarkItem } from "./mark-item";

export function MarkList() {
  const [marks, setMarks] = React.useState<Marks[]>([])

  async function handleGetMarks() {
    const store = await Store.load('store.json');
    const currentTag = await store.get<Tag>('currentTag')
    if (!currentTag) {
      return
    }
    const res = await getMarks(currentTag.id)
    setMarks(res)
  }

  useEffect(() => {
    handleGetMarks()
    emitter.on('refresh-marks', handleGetMarks)
  }, [])

  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          {marks.map((mark) => (
            <MarkItem key={mark.id} mark={mark} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}