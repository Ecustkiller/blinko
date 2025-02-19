'use client'
import useArticleStore from '@/stores/article'
import { useEffect, useState } from 'react'
import Vditor from 'vditor'
import "vditor/dist/index.css"
import CustomToolbar from './custom-toolbar'
import toolbarConfig from './custom-toolbar/config'

export function MdEditor() {
  const [editor, setEditor] = useState<Vditor>();
  const { currentArticle, saveCurrentArticle } = useArticleStore()
  
  function init() {
    const vditor = new Vditor('aritcle-md-editor', {
      height: document.documentElement.clientHeight - 100,
      toolbar: toolbarConfig,
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
    setContent(currentArticle)
  }, [currentArticle])

  return <div className='flex-1 h-full flex overflow-hidden flex-col'>
    <CustomToolbar editor={editor} />
    <div id="aritcle-md-editor" className='flex-1'></div>
  </div>
}