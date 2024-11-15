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
import emitter from "@/lib/emitter";

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
            <a
              href="#"
              key={mark.id}
              className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <div className="flex w-full items-center gap-2">
                <span>{mark.content}</span>{" "}
                <span className="ml-auto text-xs">{mark.createdAt}</span>
              </div>
            </a>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}