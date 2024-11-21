'use client'
import { Button } from "@/components/ui/button"
import { fetchAiStream } from "@/lib/ai"
import { useState } from "react"
import { MdPreview } from 'md-editor-rt';
import { useTheme } from 'next-themes'
import 'md-editor-rt/lib/preview.css';

export function Note() {
  const [text, setText] = useState("")
  const { theme } = useTheme()

  let textChunks = ''

  function aiResponse(res: string) {
    if (res !== '[DONE]') {
      textChunks += res
      setText(textChunks)
    }
  }
    
  function handleAi() {
    fetchAiStream('', aiResponse)
    setText(textChunks)
  }

  return <>
    <MdPreview value={text} theme={theme as 'light' | 'dark'} />
    <Button onClick={handleAi}>AI</Button>
  </>
}
