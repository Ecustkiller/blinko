'use client'
import { fetchAiStream } from "@/lib/ai"
import { useEffect, useState } from "react"
import { MdPreview, Themes } from 'md-editor-rt';
import { useTheme } from 'next-themes'
import useMarkStore from "@/stores/mark";
import { NoteHeader } from './note-header'
import { NoteFooter } from "./note-footer";
import 'md-editor-rt/lib/preview.css';

export function Note() {
  const [text, setText] = useState("")
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const [id] = useState('preview-only');

  const { fetchMarks, marks } = useMarkStore()

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  useEffect(() => {
    // 根据内容变化滚动到底部
    const md = document.querySelector('#preview-only-preview-wrapper')
    if (md) {
      setTimeout(() => {
        md.scroll(0, md.scrollHeight)
      }, 100);
    }
  }, [text])

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
    const request_content = `
      以下是通过截图后，使用OCR识别出的文字片段：
      ${marks.map(item => item.content).join(';\n\n')}。
      请将这些片段整理成一篇详细完整的笔记，要满足以下要求：
      - 使用 Markdown 语法。
      - 如果是代码，必须完整保留，不要随意生成。
      - 笔记片段可能缺失，内容要补全。
      - 根据笔记内容，延伸出扩展知识。
      - 笔记顺序可能是错误的，要按照正确顺序排列。
      - 文字复制的内容尽量不要修改，只处理格式化后的内容。
      - 你通过图片记录的描述，尽量将图片地址链接到笔记中的匹配位置上，不明确的图片放在文章最后。
      - 参考资料（带链接，最好是中文网站）

      请满足用户输入的自定义需求：${customText}
    `
    await fetchAiStream(request_content, aiResponse)
    setLoading(false)
  }

  return <div className="flex flex-col flex-1">
    <NoteHeader total={text.length} />
    <MdPreview id={id} className="flex-1" value={text} theme={mdTheme} />
    <NoteFooter gen={handleAi} loading={loading} />
  </div>
}
