"use client"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import useSettingStore from "@/stores/setting"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import { fetchAi } from "@/lib/ai"
import { MarkGen } from "./mark-gen"
import { useTranslations } from 'next-intl'
import { useI18n } from "@/hooks/useI18n"
import { ChatLink } from "./chat-link"
import { TooltipButton } from "@/components/tooltip-button"
import { useLocalStorage } from 'react-use';

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
  const [inputType, setInputType] = useLocalStorage('chat-input-type', 'chat')
  const markGenRef = useRef<{ openGen: () => void }>(null)
  const { isLinkMark } = useChatStore()

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
    
    const scanMarks = isLinkMark ? marks.filter(item => item.type === 'scan') : []
    const textMarks = isLinkMark ? marks.filter(item => item.type === 'text') : []
    const imageMarks = isLinkMark ? marks.filter(item => item.type === 'image') : []

    const request_content = `
      可以参考以下内容笔记的记录：
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
      使用 ${currentLocale} 语言
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
    setPlaceholder('...')
    if (!apiKey) return
    if (trashState) return
    const scanMarks = isLinkMark ? marks.filter(item => item.type === 'scan') : []
    const textMarks = isLinkMark ? marks.filter(item => item.type === 'text') : []
    const imageMarks = isLinkMark ? marks.filter(item => item.type === 'image') : []
    const userQuestionHistorys = chats.filter((item) => item.tagId === currentTagId && item.type === "chat" && item.role === 'user').map((item, index) => `${index + 1}. ${item.content}`).join(';\n\n')
    const request_content = `
      请你扮演一个笔记软件的智能助手的 placeholder，可以参考以下内容笔记的记录，
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
      使用 ${currentLocale} 语言，分析这些记录的内容，编写一个可能会向你提问的问题，用于辅助用户向你提问，不要返回用户已经提过的类似问题，不许超过 20 个字。
    `
    const content = await fetchAi(request_content)
    if (content.length < 30 && content.length > 10) {
      setPlaceholder(content + '[Tab]')
    }
  }

  // 切换输入类型
  function inputTypeChangeHandler(value: string) {
    setInputType(value)
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
  }, [apiKey, marks, isLinkMark, t])

  return (
    <footer className="relative flex items-center border rounded-lg p-2 gap-1 my-4 w-3/4">
      <ChatLink inputType={inputType} />
      <Input
        className="flex-1 relative border-none focus-visible:ring-0 shadow-none"
        disabled={!apiKey || loading}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isComposing) {
            e.preventDefault()
            if (inputType === "gen") {
              markGenRef.current?.openGen()
            } else if (inputType === "chat") {
              handleSubmit()
            }
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
      <Tabs value={inputType} onValueChange={inputTypeChangeHandler}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gen">{t('record.chat.input.organize')}</TabsTrigger>
          <TabsTrigger value="chat">{t('record.chat.input.chat')}</TabsTrigger>
        </TabsList>
      </Tabs>
      {
        inputType === 'gen' ?
          <MarkGen inputValue={text} ref={markGenRef} /> :
          <TooltipButton icon={<Send />} disabled={loading || !apiKey} tooltipText={t('record.chat.input.send')} onClick={handleSubmit} />
      }
    </footer>
  )
}
