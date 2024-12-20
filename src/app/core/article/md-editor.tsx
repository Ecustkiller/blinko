'use client'
import { MdEditor as MdEditorRT, ExposeParam, Themes, ToolbarNames } from 'md-editor-rt';
import useArticleStore from '@/stores/article';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import useSettingStore from '@/stores/setting';
import CustomToolbar from './custom-toolbar/index';
import { fileToBase64, uploadFile } from '@/lib/github';
import { RepoNames } from '@/lib/github.types';

export function MdEditor() {
  const ref = useRef<ExposeParam>(null);
  const [value, setValue] = useState('')
  const { currentArticle, setCurrentArticle , saveCurrentArticle, activeFilePath } = useArticleStore()
  const [mdTheme, setMdTheme] = useState<Themes>('light')
  const { theme } = useTheme()
  const { codeTheme, previewTheme, githubUsername } = useSettingStore()
  const [toolbar, setToolbar] = useState<ToolbarNames[]>([])

  async function handleSave(value: string) {
    if (value !== currentArticle) {
      setValue(value)
      setCurrentArticle(value)
      await saveCurrentArticle(value)
    }
  }

  async function onUploadImg(files: File[], callback: (res: string[]) => void) {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise<string>(async(resolve, reject) => {
          const fileBase64 = await fileToBase64(file)
          await uploadFile({
            ext: file.name.split('.')[1],
            file: fileBase64,
            repo: RepoNames.image
          }).then(async res => {
            await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`)
            const url = `https://fastly.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res?.data.content.name}`
            resolve(url)
          }).catch(err => {
            reject(err)
          })
        });
      })
    );
    callback(res);
  };

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
      onUploadImg={onUploadImg}
    />;
  </div>
}