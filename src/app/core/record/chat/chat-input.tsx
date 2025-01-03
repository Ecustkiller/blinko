"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link, NotebookPen, Send } from "lucide-react"
import useSettingStore from "@/stores/setting"
import { Input } from "@/components/ui/input"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import { fetchAiStream } from "@/lib/ai"
import { convertImage } from "@/lib/utils"

export function ChatInput() {
  const [text, setText] = useState("")
  const { apiKey } = useSettingStore()
  const { currentTagId } = useTagStore()
  const { insert, updateChat, loading, setLoading, saveChat, locale } = useChatStore()
  const { fetchMarks, marks } = useMarkStore()

  async function handleGen() {
    setLoading(true)
    const message = await insert({
      tagId: currentTagId,
      role: 'system',
      content: '',
      type: 'note',
      inserted: false,
      image: undefined,
    })
    if (!message) return
    await fetchMarks()
    const scanMarks = marks.filter(item => item.type === 'scan')
    const textMarks = marks.filter(item => item.type === 'text')
    const imageMarks = marks.filter(item => item.type === 'image')
    for (const image of imageMarks) {
      if (!image.url.includes('http')) {
        image.url = await convertImage(`/image/${image.url}`)
      }
    }
    const request_content = `
      以下是通过截图后，使用OCR识别出的文字片段：
      ${scanMarks.map(item => item.content).join(';\n\n')}。
      以下是通过文本复制记录的片段：
      ${textMarks.map(item => item.content).join(';\n\n')}。
      以下是插图记录的片段描述：
      ${imageMarks.map(item => `
        描述：${item.content}，
        图片地址：${item.url}
      `).join(';\n\n')}。
      请将这些片段整理成一篇详细完整的笔记，要满足以下要求：
      - 使用 ${locale} 语言。
      - 使用 Markdown 语法。
      - 如果是代码，必须完整保留，不要随意生成。
      - 笔记顺序可能是错误的，要按照正确顺序排列。
      - 文字复制的内容尽量不要修改，只处理格式化后的内容。
      ${
        imageMarks.length > 0 &&
        '- 如果存在插图记录，通过插图记录的描述，将图片链接放在笔记中的适合位置，图片地址包含 uuid，请完整返回，并对插图附带简单的描述。'
      }
      请满足用户输入的自定义需求：${text}
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
  }

  async function handleSubmit() {
    if (text === '') return
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
      请你扮演一个笔记软件的智能助手，可以参考以下内容笔记的记录，
      以下是通过截图后，使用OCR识别出的文字片段：
      ${scanMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
      以下是通过文本复制记录的片段：
      ${textMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
      以下是插图记录的片段描述：
      ${imageMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
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

  return (
    <footer className="my-4 border px-4 py-4 shadow-lg rounded-xl min-w-[500px] w-2/3 max-w-[800px] flex bg-primary-foreground h-14 items-center">
      <Button variant={"ghost"} size={"icon"} disabled={loading}>
        <Link />
      </Button>
      <Input
        className="flex-1 border-none focus-visible:ring-0 shadow-none"
        disabled={!apiKey}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="你可以提问或将记录整理为文章..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
      />
      <Button variant={"ghost"} size={"icon"} disabled={loading} onClick={handleGen}>
        <NotebookPen />
      </Button>
      <Button variant={"ghost"} size={"icon"} disabled={loading} onClick={handleSubmit}>
        <Send />
      </Button>
    </footer>
  )
}
