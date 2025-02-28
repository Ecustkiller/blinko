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

export function MdEditor() {
  const [editor, setEditor] = useState<Vditor>();
  const { currentArticle, saveCurrentArticle, loading } = useArticleStore()
  const { jsdelivr, accessToken } = useSettingStore()
  const { theme } = useTheme()
  const t = useTranslations('article.editor')
  const { currentLocale } = useI18n()

  function getLang() {
    console.log(currentLocale);
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
    if (!accessToken) {
      toast({
        variant: 'destructive',
        title: t('upload.error'),
        description: t('upload.needToken'),
      })
      return ['']
    }
    const list = await Promise.all(
      files.map((file) => {
        return new Promise<string>(async(resolve, reject) => {
          if (!file.type.includes('image')) return
          const toastNotification = toast({
            title: t('upload.uploading'),
            description: file.name,
            duration: 600000,
          })
          const fileBase64 = await fileToBase64(file)
          await uploadFile({
            ext: file.name.split('.')[1],
            file: fileBase64,
            repo: RepoNames.image
          }).then(async res => {
            let url = res?.data.content.download_url
            if (jsdelivr) {
              const store = await Store.load('store.json');
              const githubUsername = await store.get('githubUsername')
              await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`)
              url = `https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`
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