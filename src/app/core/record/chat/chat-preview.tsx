import { MdPreview, Themes } from 'md-editor-rt';
import useSettingStore from "@/stores/setting";
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'

export default function ChatPreview({text}: {text: string}) {
  const [id] = useState('preview-only');
  const { theme } = useTheme()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { codeTheme, previewTheme } = useSettingStore()

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])
  
  return <div>
    <MdPreview
      id={id}
      className="flex-1"
      value={text}
      theme={mdTheme}
      codeTheme={codeTheme}
      previewTheme={previewTheme}
    />
  </div>
}