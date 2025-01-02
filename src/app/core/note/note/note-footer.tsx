"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CircleAlert, Link, Loader2, Package, Send } from "lucide-react"
import useNoteStore from "@/stores/note"
import useSettingStore from "@/stores/setting"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import { fetchAiStream } from "@/lib/ai"

export function NoteFooter({gen}: {gen: (text: string) => void}) {
  const [text, setText] = useState("")
  const { locale } = useNoteStore()
  const { apiKey, model } = useSettingStore()
  const { currentTagId } = useTagStore()
  const { insert, updateChat, loading, setLoading, saveChat } = useChatStore()
  const { fetchMarks, marks } = useMarkStore()

  const router = useRouter()

  async function handleSuccess() {
    gen(text)
  }

  async function handleSubmit() {
    setText('')
    setLoading(true)
    await insert({
      tagId: currentTagId,
      role: 'user',
      content: text,
      type: 'chat',
      inserted: false,
      image: undefined,
    })

    const message = await insert({
      tagId: currentTagId,
      role: 'system',
      content: '',
      type: 'chat',
      inserted: false,
      image: undefined,
    })
    if (!message) return

    await fetchMarks()
    
    const scanMarks = marks.filter(item => item.type === 'scan')
    const textMarks = marks.filter(item => item.type === 'text')
    const imageMarks = marks.filter(item => item.type === 'image')

    const request_content = `
      请你扮演一个笔记软件的智能助手，可以参考以下内容笔记的碎片记录，
      以下是通过截图后，使用OCR识别出的文字片段：
      ${scanMarks.map(item => item.content).join(';\n\n')}。
      以下是通过文本复制记录的片段：
      ${textMarks.map(item => item.content).join(';\n\n')}。
      以下是插图记录的片段描述：
      ${imageMarks.map(item => item.content).join(';\n\n')}。
      使用 ${locale} 语言，不许使用 markdown 语法，回复用户的信息：
      ${text}
    `

    let textChunks = ''

    await fetchAiStream(request_content, (res) => {
      if (res!== '[DONE]') {
        textChunks += res
        updateChat({
          ...message,
         content: textChunks,
        })
      } else if (res === '[DONE]') {
        setLoading(false)
        saveChat({
          ...message,
         content: textChunks,
        })
      }
    })
    setLoading(false)
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
          <Button variant={"ghost"} size={"icon"} disabled={loading} onClick={handleSubmit}>
            { loading ? <Loader2 className="animate-spin" /> : <Send /> }
          </Button>
        </div>
      </div>
    </footer>
  )
}
