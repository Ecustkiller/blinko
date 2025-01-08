'use client'
import { MdEditor as MdEditorRT, ExposeParam, Themes } from 'md-editor-rt';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import useSettingStore from '@/stores/setting';
import CustomToolbar from './custom-toolbar/index';
import { fileToBase64, uploadFile } from '@/lib/github';
import { RepoNames } from '@/lib/github.types';
import { toast } from '@/hooks/use-toast';
import { hasHTML, readHtml, writeText } from "tauri-plugin-clipboard-api";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import TurndownService from 'turndown/lib/turndown.browser.es.js';
import { gfm } from 'turndown-plugin-gfm/lib/turndown-plugin-gfm.browser.es.js';
import CustomFooter from './custom-footer';

export function MdEditor() {
  const ref = useRef<ExposeParam>(null);
  const [value, setValue] = useState('')
  const { currentArticle, setCurrentArticle , saveCurrentArticle, activeFilePath, html2md } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const { codeTheme, previewTheme, githubUsername, jsdelivr } = useSettingStore()
  const footers = [0];
  let isChangeFile = false;

  const defFooters = [<CustomFooter key={"foot"} mdRef={ref} />];
  
  async function handleSave(value: string) {
    if (isChangeFile) return
    if (value !== currentArticle) {
      setValue(value)
      setCurrentArticle(value)
      await saveCurrentArticle(value)
    }
  }

  async function onUploadImg(files: File[], callback: (res: string[]) => void) {
    const res = await uploadImages(files);
    callback(res);
  };

  async function uploadImages(files: File[]) {
    const list = await Promise.all(
      files.map((file) => {
        return new Promise<string>(async(resolve, reject) => {
          if (!file.type.includes('image')) return
          const t = toast({
            title: '正在上传图片',
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
              await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`)
              url = `https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`
            }
            resolve(url)
          }).catch(err => {
            reject(err)
          }).finally(() => {
            t.dismiss()
          })
        });
      })
    );
    return list
  }

  async function dropHandler(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const res = await uploadImages(fileArray)
    res.forEach(item => {
      ref.current?.insert(() => {
        return {
          targetValue: `![](${item})\n\n`,
          select: false,
        };
      })
    })
  }

  async function revertHtml2Md() {
    const hasHtml = await hasHTML()
    if (hasHtml && html2md) {
      const html = await readHtml()
      const turndownService = new (TurndownService as any)({
        bulletListMarker: '-',
      })
      turndownService.use(gfm)
      const md = turndownService.turndown(html)
      await writeText(md)
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

  useEffect(() => {
    isChangeFile = true
    setTimeout(() => {
      isChangeFile = false
    }, 100);
  }, [activeFilePath])

  useEffect(() => {
    let unlisten: UnlistenFn;
    async function init() {
      unlisten = await listen('tauri://focus', revertHtml2Md)
    }
    init()
    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [html2md])

  return <div className='flex-1'>
    <CustomToolbar mdRef={ref} />
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
      toolbars={[]}
      footers={footers}
      defFooters={defFooters}
      value={value}
      onChange={handleSave}
      onUploadImg={onUploadImg}
      onDrop={dropHandler}
    />;
  </div>
}