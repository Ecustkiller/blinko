"use client"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function NoteFooter({gen}: {gen: () => void}) {
  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <footer className="h-36 border-t p-4">
      <Textarea placeholder="请输入你的个性化需求（可选）" />
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">自动生成</Label>
        </div>
        <Button onClick={gen}>生成</Button>
      </div>
    </footer>
  )
}
