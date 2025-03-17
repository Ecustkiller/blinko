'use client'
import useArticleStore from '@/stores/article'
import { useEffect, useState } from 'react'
import Vditor from 'vditor'
import "vditor/dist/index.css"
import CustomToolbar from './custom-toolbar'
import './style.scss'
import config from './custom-toolbar/config'
import { useTheme } from 'next-themes'
import { toast } from '@/hooks/use-toast'
import { fileToBase64, uploadFile } from '@/lib/github'
import { RepoNames } from '@/lib/github.types'
import useSettingStore from '@/stores/setting'
import { Store } from '@tauri-apps/plugin-store'
import { useTranslations } from 'next-intl'
import { useI18n } from '@/hooks/useI18n'
import emitter from '@/lib/emitter'
import dayjs from 'dayjs'

export function MdEditor() {
  const [editor, setEditor] = useState<Vditor>();
  const { currentArticle, saveCurrentArticle, loading } = useArticleStore()
  const { jsdelivr } = useSettingStore()
  const { theme, setTheme } = useTheme()
  const t = useTranslations('article.editor')
  const { currentLocale } = useI18n()

  function getLang() {
    switch (currentLocale) {
      case 'en':
        return 'en_US'
      case 'zh':
        return 'zh_CN'
      default:
        return 'zh_CN'
    }
  }

  function init() {
    const vditor = new Vditor('aritcle-md-editor', {
      lang: getLang(),
      height: document.documentElement.clientHeight - 100,
      icon: 'material',
      cdn: '',
      theme: theme === 'dark' ? 'dark' : 'classic',
      toolbar: config as any,
      hint: {
        extend: [
          {
            key: '...',
            hint: async () => {
              emitter.emit('toolbar-continue');
              return []
            }
          },
          {
            key: '???',
            hint: async () => {
              emitter.emit('toolbar-question');
              return []
            }
          },
        ]
      },
      after: () => {
        setEditor(vditor);
      },
      input: (value) => {
        saveCurrentArticle(value)
      },
      upload: {
        async handler(files: File[]) {
          const filesUrls = await uploadImages(files)
          if (vditor) {
            for (let i = 0; i < filesUrls.length; i++) {
              vditor.insertValue(`![${files[i].name}](${filesUrls[i]})`)
            }
          }
          return filesUrls.join('\n')
        }
      }
    })
  }

  async function uploadImages(files: File[]) {
    const list = await Promise.all(
      files.map((file) => {
        return new Promise<string>(async(resolve, reject) => {
          if (!file.type.includes('image')) return
          const toastNotification = toast({
            title: t('upload.uploading'),
            description: file.name,
            duration: 600000,
          })
          const path = dayjs().format('YYYY-MM')
          const fileBase64 = await fileToBase64(file)
          const ext = file.name.split('.')[file.name.split('.').length - 1]
          await uploadFile({
            ext,
            file: fileBase64,
            repo: RepoNames.image,
            path
          }).then(async res => {
            let url = res?.data.content.download_url
            if (jsdelivr) {
              const store = await Store.load('store.json');
              const githubUsername = await store.get('githubUsername')
              await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${path}/${res?.data.content.name}`)
              url = `https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${path}/${res?.data.content.name}`
            }
            resolve(url)
          }).catch(err => {
            reject(err)
          }).finally(() => {
            toastNotification.dismiss()
          })
        });
      })
    );
    return list
  }

  function setContent(content: string) {
    if (editor) {
      editor.setValue(content || '', true)
    }
  }

  useEffect(() => {
    init()
  }, [currentLocale])

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
    if (theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')  
      } else {
        setTheme('light')
      }
    } else {
      if (editor) {
        const editorTheme = theme === 'dark' ? 'dark' : 'light'
        const contentTheme = theme === 'dark' ? 'dark' : 'light'
        const codeTheme = theme === 'dark' ? 'github-dark' : 'github-light'
        editor.setTheme(editorTheme === 'dark' ? 'dark' : 'classic', contentTheme, codeTheme)
      }
    }
  }, [theme, editor])

  useEffect(() => {
    setContent(currentArticle)
  }, [currentArticle])

  return <div className='flex-1 h-screen flex flex-col'>
    {
      editor && <CustomToolbar editor={editor} />
    }
    <div id="aritcle-md-editor" className='flex-1'></div>
  </div>
}