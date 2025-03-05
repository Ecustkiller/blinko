import { ExposeParam, MdPreview, Themes } from 'md-editor-rt';
import useSettingStore from "@/stores/setting";
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes'
import useChatStore from '@/stores/chat';

export default function ChatPreview({text}: {text: string}) {
  const [id] = useState('preview-only');
  const ref = useRef<ExposeParam>(null);
  const { theme } = useTheme()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { codeTheme, previewTheme } = useSettingStore()
  const { chats } = useChatStore()

  function bindPreviewLink() {
    setTimeout(() => {
      const previewDoms = document.querySelectorAll('.md-editor')
      for (let index = 0; index < previewDoms.length; index++) {
        const previewDom = previewDoms[index];
        if (!previewDom) continue
        previewDom.querySelectorAll('a').forEach(item => {
          item.setAttribute('target', '_blank')
          item.setAttribute('rel', 'noopener noreferrer')
        })        
      }
    }, 100);
  }

  useEffect(() => {
    bindPreviewLink()
  }, [chats])

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])
  
  return <div>
    <MdPreview
      id={id}
      ref={ref}
      className="flex-1"
      value={text}
      theme={mdTheme}
      codeTheme={codeTheme}
      previewTheme={previewTheme}
    />
  </div>
}