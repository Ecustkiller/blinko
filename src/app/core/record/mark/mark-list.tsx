'use client'

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import React, { useEffect } from "react"
import { MarkItem } from "./mark-item";
import useMarkStore from "@/stores/mark";
import { MarkLoading } from "./mark-loading";
import { Clipboard } from "./clipboard";

export function MarkList() {
  const { marks, fetchMarks, queues, trashState } = useMarkStore()

  useEffect(() => {
    fetchMarks()
  }, [fetchMarks])

  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          {
            trashState ?
            null : <Clipboard />
          }
          {
            queues.map(mark => {
              return (
                <MarkLoading key={mark.queueId} mark={mark} />
              )
            })
          }
          {marks.map((mark) => (
            <MarkItem key={mark.id} mark={mark} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}