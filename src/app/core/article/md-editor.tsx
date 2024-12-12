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
  const { currentArticle, setCurrentArticle, loadFileTree } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const { codeTheme, previewTheme } = useSettingStore()

  const toolbarsExclude: ToolbarNames[] = ['github', 'catalog', 'fullscreen']

  function handleSave() {
    setCurrentArticle(value)
    loadFileTree()
  }

  useEffect(() => {
    setMdTheme(theme as Themes)
  }, [theme])

  useEffect(() => {
    setValue(currentArticle)
  }, [currentArticle])

  return <div className='flex-1'>
    <CustomToolbar mdRef={ref} />
    <MdEditorRT
      id="aritcle-md-editor"
      ref={ref}
      theme={mdTheme}
      codeTheme={codeTheme}
      previewTheme={previewTheme}
      codeFoldable={false}
      preview={false}
      className='!border-none'
      noImgZoomIn
      toolbarsExclude={toolbarsExclude}
      // toolbars={toolbars}
      footers={[]}
      value={value}
      onChange={setValue}
      onSave={handleSave}
      // defToolbars={defToolbars(ref)}
    />;
  </div>
}