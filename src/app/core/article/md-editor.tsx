'use client'
import { MdEditor as MdEditorRT, Themes } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function MdEditor() {
  const { currentArticle, setCurrentArticle } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  return <MdEditorRT theme={mdTheme} className='flex-1 !h-screen !border-none' noImgZoomIn value={currentArticle} onChange={setCurrentArticle} />;
}