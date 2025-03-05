"use client"
import * as React from "react"
import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import useSettingStore from "@/stores/setting"
import { Input } from "@/components/ui/input"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import { fetchAi } from "@/lib/ai"
import { TooltipButton } from "@/components/tooltip-button"
import { MarkGen } from "./mark-gen"
import { useTranslations } from 'next-intl'
import { useI18n } from "@/hooks/useI18n"

export function ChatInput() {
  const [text, setText] = useState("")
  const { apiKey } = useSettingStore()
  const { currentTagId } = useTagStore()
  const { insert, loading, setLoading, saveChat, chats } = useChatStore()
  const { fetchMarks, marks, trashState } = useMarkStore()
  const [isComposing, setIsComposing] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const t = useTranslations()
  const { currentLocale } = useI18n()

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
      以下聊天记录：
      ${
        chats.filter((item) => item.tagId === currentTagId && item.type === "chat").map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')
      }。
      使用 ${currentLocale} 语言，不许使用 markdown 语法，回复用户的信息：
      ${text}
    `
    const content = await fetchAi(request_content)
    await saveChat({
      ...message,
      content,
    })
    setLoading(false)
  }

  async function genInputPlaceholder() {
    if (!apiKey) return
    if (trashState) return
    const scanMarks = marks.filter(item => item.type === 'scan')
    const textMarks = marks.filter(item => item.type === 'text')
    const imageMarks = marks.filter(item => item.type === 'image')
    const userQuestionHistorys = chats.filter((item) => item.tagId === currentTagId && item.type === "chat" && item.role === 'user').map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')
    const request_content = `
      请你扮演一个笔记软件的智能助手，可以参考以下内容笔记的记录，
      以下是通过截图后，使用OCR识别出的文字片段：
      ${scanMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
      以下是通过文本复制记录的片段：
      ${textMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
      以下是插图记录的片段描述：
      ${imageMarks.map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')}。
      以下聊天记录：
      ${
        chats.filter((item) => item.tagId === currentTagId && item.type === "chat").map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')
      }。
      以下是用户之前的提问记录：
      ${userQuestionHistorys}。
      使用 ${currentLocale} 语言，分析这些记录的内容，编写一个可能会向你提问的问题，用于辅助用户向你提问，不要返回用户已经提过的类似问题，不许超过 20 个字，可以参考以下内容：
      什么是 ** ？
      如何解决 ** 问题？
      总结 ** 。
    `
    const content = await fetchAi(request_content)
    if (content.length < 30 && content.length > 10) {
      setPlaceholder(content + '[Tab]')
    }
  }

  useEffect(() => {
    if (!apiKey) {
      setPlaceholder(t('record.chat.input.placeholder.noApiKey'))
      return
    }
    if (marks.length === 0) {
      setPlaceholder(t('record.chat.input.placeholder.default'))
      return
    }
    genInputPlaceholder()
  }, [apiKey, marks, t])

  return (
    <footer className="relative flex shadow-lg rounded-xl overflow-hidden min-w-[500px] w-2/3 max-w-[800px] my-4">
      <div className={`${loading ? 'bg-gradient-to-r' : 'bg-border'} absolute border border-transparent inset-0 rounded-xl from-blue-500 to-purple-500 animate-gradient`}></div>
      <div className={`m-[1px] mr-[2px] relative px-4 py-4 rounded-[11px] w-full flex bg-primary-foreground h-14 items-center`}>
        <Input
          className="flex-1 relative border-none focus-visible:ring-0 shadow-none"
          disabled={!apiKey || loading}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              e.preventDefault()
              handleSubmit()
            }
            if (e.key === "Tab") {
              e.preventDefault()
              setText(placeholder.replace('[Tab]', ''))
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setTimeout(() => {
            setIsComposing(false)
          }, 0)}
        />
        <MarkGen />
        <TooltipButton icon={<Send />} disabled={loading || !apiKey} tooltipText={t('record.chat.input.send')} onClick={handleSubmit} />
      </div>
    </footer>
  )
}
