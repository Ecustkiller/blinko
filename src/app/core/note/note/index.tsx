'use client'
import { fetchAiStream } from "@/lib/ai"
import { useEffect, useState } from "react"
import { MdPreview, Themes } from 'md-editor-rt';
import { useTheme } from 'next-themes'
import useMarkStore from "@/stores/mark";
import { NoteHeader } from './note-header'
import { NoteFooter } from "./note-footer";
import { initNotesDb } from "@/db/notes";
import useNoteStore from "@/stores/note";

export function Note() {
  const [text, setText] = useState("")
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const [id] = useState('preview-only');

  const { fetchMarks, marks } = useMarkStore()
  const { locale, count, currentNote, fetchCurrentNote, setLoading, loading, clearCurrentNote } = useNoteStore()

  useEffect(() => {
    initNotesDb()
    fetchCurrentNote()
  }, [fetchCurrentNote])

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  useEffect(() => {
    const decodedText = decodeURIComponent(currentNote?.content || '')
    setText(decodedText)
    if (currentNote) {
      const md = document.querySelector('#preview-only-preview-wrapper')
      if (md) md.scroll(0, 0)
    }
  }, [currentNote])

  useEffect(() => {
    // 根据内容变化滚动到底部
    const md = document.querySelector('#preview-only-preview-wrapper')
    if (md && loading) md.scroll(0, md.scrollHeight)
  }, [loading, text])

  let textChunks = ''

  function aiResponse(res: string) {
    if (res !== '[DONE]') {
      textChunks += res
      setText(textChunks)
    }
  }
    
  async function handleAi(customText: string) {
    setLoading(true)
    await fetchMarks()
    const scanMarks = marks.filter(item => item.type === 'scan')
    const textMarks = marks.filter(item => item.type === 'text')
    const imageMarks = marks.filter(item => item.type === 'image')
    const request_content = `
      以下是通过截图后，使用OCR识别出的文字片段：
      ${scanMarks.map(item => item.content).join(';\n\n')}。
      以下是通过文本复制记录的片段：
      ${textMarks.map(item => item.content).join(';\n\n')}。
      以下是通过图片复制记录的片段描述：
      ${imageMarks.map(item => `
        描述：${item.content}，
        图片地址：${item.url}
      `).join(';\n\n')}。
      请将这些片段整理成一篇详细完整的笔记，要满足以下要求：
      - 使用 ${locale} 语言。
      - 使用 Markdown 语法。
      - 字数控制在 ${count} 字以内。
      - 如果是代码，必须完整保留，不要随意生成。
      - 笔记片段可能缺失，内容要补全。
      - 根据笔记内容，延伸出扩展知识。
      - 笔记顺序可能是错误的，要按照正确顺序排列。
      - 文字复制的内容尽量不要修改，只处理格式化后的内容。
      - 你通过图片记录的描述，尽量将图片地址链接到笔记中的匹配位置上，不明确的图片放在文章最后。
      - 参考资料（带链接，最好是${locale}网站）

      请满足用户输入的自定义需求：${customText}
    `
    await fetchAiStream(request_content, aiResponse)
    setLoading(false)
    clearCurrentNote()
  }

  return <div className="flex flex-col flex-1">
    <NoteHeader text={text} />
    <MdPreview id={id} className="flex-1" value={text} theme={mdTheme} />
    <NoteFooter gen={handleAi} />
  </div>
}
