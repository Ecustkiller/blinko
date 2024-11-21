'use client'
import { fetchAiStream } from "@/lib/ai"
import { useEffect, useState } from "react"
import { MdPreview, Themes } from 'md-editor-rt';
import { useTheme } from 'next-themes'
import { NoteHeader } from './note-header'
import { NoteFooter } from "./note-footer";
import 'md-editor-rt/lib/preview.css';

export function Note() {
  const [text, setText] = useState("")
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const [id] = useState('preview-only');

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  useEffect(() => {
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
    
  function handleAi() {
    fetchAiStream('写一篇500字的文章，关于截图生成笔记的 app 实现方案。', aiResponse)
    setText(textChunks)
  }

  return <div className="flex flex-col flex-1">
    <NoteHeader total={text.length} />
    <MdPreview id={id} className="flex-1" value={text} theme={mdTheme} />
    <NoteFooter gen={handleAi} />
  </div>
}
