'use client'
import useArticleStore from '@/stores/article'
import { useEffect, useState } from 'react'
import Vditor from 'vditor'
import "vditor/dist/index.css"
import CustomToolbar from './custom-toolbar'
import './style.scss'
import config from './custom-toolbar/config'
import { useTheme } from 'next-themes'

export function MdEditor() {
  const [editor, setEditor] = useState<Vditor>();
  const { currentArticle, saveCurrentArticle, loading } = useArticleStore()
  const { theme } = useTheme()
  
  function init() {
    const vditor = new Vditor('aritcle-md-editor', {
      height: document.documentElement.clientHeight - 100,
      icon: 'material',
      cdn: '',
      theme: theme === 'dark' ? 'dark' : 'classic',
      toolbar: config as any,
      after: () => {
        setEditor(vditor);
      },
      input: (value) => {
        saveCurrentArticle(value)
      }
    })
  }

  function setContent(content: string) {
    if (editor) {
      editor.setValue(content || '', true)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (editor) {
      if (loading) {
        editor.disabled()
      } else {
        editor.enable()
      }
    }
  }, [loading])

  useEffect(() => {
    if (editor) {
      editor.setTheme(theme === 'dark' ? 'dark' : 'classic')
    }
  }, [theme])

  useEffect(() => {
    setContent(currentArticle)
  }, [currentArticle])

  return <div className='flex-1 h-full flex flex-col'>
    {
      editor && <CustomToolbar editor={editor} />
    }
    <div id="aritcle-md-editor" className='flex-1'></div>
  </div>
}