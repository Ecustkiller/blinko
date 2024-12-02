"use client"
import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import useNoteStore from "@/stores/note"

export function NoteFooter({gen}: {gen: (text: string) => void}) {
  const [text, setText] = useState("")
  const { loading, setLoading } = useNoteStore()

  async function handleSuccess() {
    setLoading(true)
    gen(text)
  }

  return (
    <footer className="h-36 border-t p-4">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="请输入你的个性化需求（可选）" />
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">自动生成</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={loading} onClick={handleSuccess}>
            { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
            生成
          </Button>
        </div>
      </div>
    </footer>
  )
}
