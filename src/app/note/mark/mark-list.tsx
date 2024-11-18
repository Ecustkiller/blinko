'use client'

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import React, { useEffect } from "react"
import { MarkItem } from "./mark-item";
import useMarkStore from "@/stores/mark";

export function MarkList() {
  const { marks, fetchMarks } = useMarkStore()

  useEffect(() => {
    fetchMarks()
  }, [fetchMarks])

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