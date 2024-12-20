"use client"
import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CircleAlert, Loader2, Package } from "lucide-react"
import useNoteStore from "@/stores/note"
import useSettingStore from "@/stores/setting"
import { useRouter } from "next/navigation";
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
    <footer className="h-36 border-t p-4">
      <Textarea disabled={!apiKey} value={text} onChange={(e) => setText(e.target.value)} placeholder="请输入你的个性化需求（可选）" />
      <div className="flex items-center justify-end mt-4">
        {
          (model && apiKey) &&
          <div className="flex items-center gap-1 mr-4 text-sm text-zinc-500 cursor-pointer hover:underline" onClick={handleSetting}>
            <Package className="size-4" />
            {model}
          </div>
        }
        <div className="flex items-center gap-2">
          {
            apiKey ? 
            <Button disabled={loading} onClick={handleSuccess}>
              { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
              整理
            </Button> :
            <div className="flex gap-1 items-center">
              <Button variant="destructive" onClick={handleSetting}>
                <CircleAlert /> 配置 API KEY
              </Button>
            </div>
          }
        </div>
      </div>
    </footer>
  )
}
