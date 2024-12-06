'use client'
import clipboard from "tauri-plugin-clipboard-api";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BaseDirectory, copyFile, exists, mkdir, readFile, writeFile } from '@tauri-apps/plugin-fs';
import { Button } from "@/components/ui/button";
import useTagStore from "@/stores/tag";
import useSettingStore from "@/stores/setting";
import useMarkStore from "@/stores/mark";
import { v4 as uuid } from 'uuid'
import ocr from "@/lib/ocr";
import { fetchAiDesc } from "@/lib/ai";
import { insertMark, Mark } from "@/db/marks";
import { uint8ArrayToBase64, uploadFile } from "@/lib/github";

export function ClipboardImage() {
  const [image, setImage] = useState('')
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { sync } = useSettingStore()
  const { fetchMarks, addQueue, setQueue, removeQueue } = useMarkStore()
  async function read() {
    try{
      const image = await clipboard.readImageBase64()
      const uint8Array = Uint8Array.from(atob(image), c => c.charCodeAt(0))
      await writeFile('clipboard.png', uint8Array, { baseDir: BaseDirectory.AppData })
      setImage(`data:image/png;base64, ${image}`)
    } catch(e) {
      console.log(e)
    }
  }

  async function handleInset() {
    setImage('')
    const queueId = uuid()
    // 获取文件后缀
    addQueue({ queueId, progress: '保存图片', type: 'image', startTime: Date.now() })
    const isImageFolderExists = await exists('image', { baseDir: BaseDirectory.AppData})
    if (!isImageFolderExists) {
      await mkdir('image', { baseDir: BaseDirectory.AppData})
    }
    copyFile('clipboard.png', `image/${queueId}.png`, { fromPathBaseDir: BaseDirectory.AppData, toPathBaseDir: BaseDirectory.AppData})
    setQueue(queueId, { progress: ' OCR 识别' });
    const content = await ocr(`image/${queueId}.png`)
    setQueue(queueId, { progress: ' AI 内容识别' });
    const desc = await fetchAiDesc(content).then(res => res.choices[0].message.content)
    const mark: Partial<Mark> = {
      tagId: currentTagId,
      type: 'image',
      content,
      url: `${queueId}.png`,
      desc,
    }
    const file = await readFile(`image/${queueId}.png`, { baseDir: BaseDirectory.AppData  })
    if (sync) {
      setQueue(queueId, { progress: '上传至图床' });
      const res = await uploadFile({
        path: 'images',
        ext: 'png',
        file: uint8ArrayToBase64(file),
      })
      console.log(res);
      mark.url = res ? res.data.content.download_url : `${queueId}.png}`
    }
    removeQueue(queueId)
    await insertMark(mark)
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
    await clipboard.clear()
  }

  useEffect(() => {
    window.addEventListener('visibilitychange', read)
  }, [])

  return (
    image ? (
      <div className="relative flex justify-center items-center">
        <Image src={image} width={0} height={0} alt="clipboard image" className="w-full object-cover" />
        <div className="absolute z-10 flex justify-center items-center gap-4 flex-col w-full h-full bg-black text-white bg-opacity-50">
          <p className="text-base">检测到剪贴板内的图片</p>
          <Button onClick={handleInset}>插入</Button>
        </div>
      </div>
    ) :
    null
  )
}