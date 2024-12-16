'use client'
import { MdEditor as MdEditorRT, ExposeParam, Themes, ToolbarNames } from 'md-editor-rt';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
// import { defToolbars, toolbars } from './md-toolbar';
import useSettingStore from '@/stores/setting';
import CustomToolbar from './custom-toolbar/index';

export function MdEditor() {
  const ref = useRef<ExposeParam>(null);
  const [value, setValue] = useState('')
  const { currentArticle, saveCurrentArticle, activeFilePath } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const { codeTheme, previewTheme } = useSettingStore()
  const [toolbar, setToolbar] = useState<ToolbarNames[]>([])

  async function handleSave(value: string) {
    if (value !== currentArticle) {
      setValue(value)
      await saveCurrentArticle(value)
    }
  }

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  useEffect(() => {
    if (value !== currentArticle) {
      setValue(currentArticle)
    }
  }, [currentArticle])

  return <div className='flex-1'>
    <CustomToolbar mdRef={ref} settings={{
      toolbar,
      setToolbar
    }} />
    <MdEditorRT
      id="aritcle-md-editor"
      ref={ref}
      theme={mdTheme}
      codeTheme={codeTheme}
      disabled={!activeFilePath}
      previewTheme={previewTheme}
      codeFoldable={false}
      preview={false}
      className='!border-none'
      noImgZoomIn
      toolbars={toolbar}
      value={value}
      onChange={handleSave}
    />;
  </div>
}