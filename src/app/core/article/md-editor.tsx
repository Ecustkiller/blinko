'use client'
import { MdEditor as MdEditorRT, ExposeParam, Themes } from 'md-editor-rt';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { defToolbars, toolbars } from './md-toolbar';

export function MdEditor() {
  const ref = useRef<ExposeParam>(null);
  const { currentArticle, setCurrentArticle } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  return <MdEditorRT
    ref={ref}
    theme={mdTheme}
    className='flex-1 !h-screen !border-none'
    noImgZoomIn
    toolbars={toolbars}
    footers={[]}
    value={currentArticle}
    onChange={setCurrentArticle}
    defToolbars={defToolbars(ref)}
  />;
}