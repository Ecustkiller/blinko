'use client'
import { MdEditor as MdEditorRT, ExposeParam, Themes } from 'md-editor-rt';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
// import { defToolbars, toolbars } from './md-toolbar';
import useSettingStore from '@/stores/setting';
import CustomToolbar from './custom-toolbar/index';

export function MdEditor() {
  const ref = useRef<ExposeParam>(null);
  const { currentArticle, setCurrentArticle } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const { codeTheme, previewTheme } = useSettingStore()

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  return <div className='flex-1'>
    <CustomToolbar mdRef={ref} />
    <MdEditorRT
      ref={ref}
      theme={mdTheme}
      codeTheme={codeTheme}
      previewTheme={previewTheme}
      codeFoldable={false}
      preview={false}
      className='!h-screen !border-none'
      noImgZoomIn
      // toolbars={toolbars}
      footers={[]}
      value={currentArticle}
      onChange={setCurrentArticle}
      // defToolbars={defToolbars(ref)}
    />;
  </div>
}