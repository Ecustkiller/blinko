"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CircleAlert, Link, Loader2, Package, Send } from "lucide-react"
import useNoteStore from "@/stores/note"
import useSettingStore from "@/stores/setting"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
export function NoteFooter({gen}: {gen: (text: string) => void}) {
  const [text, setText] = useState("")
  const { loading, setLoading } = useNoteStore()
  const { apiKey, model } = useSettingStore()
  const router = useRouter()

  async function handleSuccess() {
    setLoading(true)
    gen(text)
  }

  function handleSetting() {
    router.push('/core/setting?anchor=ai', { scroll: false });
  }

  return (
    <footer className="mb-4 border px-4 py-4 shadow-lg rounded-xl min-w-[500px] w-2/3 max-w-[800px] flex bg-primary-foreground h-14 gap-2 items-center">
      <Input
        className="flex-1 border-none focus-visible:ring-0 shadow-none"
        disabled={!apiKey}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="关联你的记录或笔记回答你的任何问题..."
      />
      {
        (model && apiKey) ?
        <div className="flex items-center gap-1 text-sm text-zinc-500 cursor-pointer hover:underline" onClick={handleSetting}>
          <Package className="size-4" />
          {model}
        </div> :
        <div className="flex gap-1 items-center">
          <Button variant="destructive" onClick={handleSetting}>
            <CircleAlert /> 配置 API KEY
          </Button>
        </div>
      }
      <Button variant={"ghost"} size={"icon"} disabled={loading} onClick={handleSuccess}>
        <Link />
      </Button>
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"icon"} disabled={loading} onClick={handleSuccess}>
            { loading ? <Loader2 className="animate-spin" /> : <Send /> }
          </Button>
        </div>
      </div>
    </footer>
  )
}
