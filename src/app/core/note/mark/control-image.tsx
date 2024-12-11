import { TooltipButton } from "@/components/tooltip-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { insertMark, Mark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { BaseDirectory, exists, mkdir, writeFile } from "@tauri-apps/plugin-fs"
import { ImagePlus } from "lucide-react"
import { useState } from "react"
import { uploadFile, uint8ArrayToBase64 } from "@/lib/github"
import useSettingStore from "@/stores/setting"
import { v4 as uuid } from 'uuid'

export function ControlImage() {
  const [open, setOpen] = useState(false);

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { sync, apiKey, markDescGen, githubUsername, repositoryName } = useSettingStore()
  const { fetchMarks, addQueue, setQueue, removeQueue } = useMarkStore()

  async function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setOpen(false)
    const queueId = uuid()
    // 获取文件后缀
    addQueue({ queueId, progress: '保存图片', type: 'image', startTime: Date.now() })
    const isImageFolderExists = await exists('image', { baseDir: BaseDirectory.AppData})
    if (!isImageFolderExists) {
      await mkdir('image', { baseDir: BaseDirectory.AppData})
    }
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`
    const data = new Uint8Array(await file.arrayBuffer())
    await writeFile(`image/${filename}`, data, { baseDir: BaseDirectory.AppData})
    setQueue(queueId, { progress: ' OCR 识别' });
    const content = await ocr(`image/${filename}`)
    setQueue(queueId, { progress: ' AI 内容识别' });
    let desc = ''
    if (apiKey && markDescGen) {
      desc = await fetchAiDesc(content).then(res => res ? res.choices[0].message.content : content)
    } else {
      desc = content
    }
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
    const mark: Partial<Mark> = {
      tagId: currentTagId,
      type: 'image',
      content,
      url: filename,
      desc,
    }
    if (sync) {
      setQueue(queueId, { progress: '上传至图床' });
      const res = await uploadFile({
        path: 'images',
        ext,
        file: uint8ArrayToBase64(data),
      })
      if (res) {
        setQueue(queueId, { progress: '通知 jsdelivr 缓存' });
        await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${repositoryName}@main/images/${res.data.content.name}`)
        mark.url = `https://fastly.jsdelivr.net/gh/${githubUsername}/${repositoryName}@main/images/${res.data.content.name}`
      } else {
        mark.url = filename
      }
    }
    removeQueue(queueId)
    await insertMark(mark)
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipButton icon={<ImagePlus />} tooltipText="插图" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>插图</DialogTitle>
          <DialogDescription>
            在整理笔记时，将会在合适的位置插入图片。
          </DialogDescription>
        </DialogHeader>
        <Input id="picture" type="file" onChange={selectImage} />
      </DialogContent>
    </Dialog>
  )
}