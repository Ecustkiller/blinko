import { TooltipButton } from "@/components/tooltip-button"
import { insertMark, Mark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { BaseDirectory, copyFile, exists, mkdir, readFile } from "@tauri-apps/plugin-fs"
import { ImagePlus } from "lucide-react"
import { uploadFile, uint8ArrayToBase64 } from "@/lib/github"
import useSettingStore from "@/stores/setting"
import { v4 as uuid } from 'uuid'
import { RepoNames } from "@/lib/github.types"
import { open } from '@tauri-apps/plugin-dialog';

export function ControlImage() {

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { apiKey, markDescGen, githubUsername } = useSettingStore()
  const { fetchMarks, addQueue, setQueue, removeQueue } = useMarkStore()

  async function selectImages() {
    const filePaths = await open({
      multiple: true,
      directory: false,
      filters: [{
        name: 'Image',
        extensions: ['png', 'jpeg', 'jpg', 'gif', 'webp','svg', 'bmp', 'ico']
      }]
    });
    if (!filePaths) return
    filePaths.forEach(async (path) => {
      await uploadImage(path)
    })
  }

  async function uploadImage(path: string) {
    const queueId = uuid()
    addQueue({ queueId, progress: '缓存图片', type: 'image', startTime: Date.now() })
    const ext = path.substring(path.lastIndexOf('.') + 1)
    const isImageFolderExists = await exists('image', { baseDir: BaseDirectory.AppData})
    if (!isImageFolderExists) {
      await mkdir('image', { baseDir: BaseDirectory.AppData})
    }
    await copyFile(path, `image/${queueId}.${ext}`, { toPathBaseDir: BaseDirectory.AppData})
    const file = await readFile(path)
    const filename = `${queueId}.${ext}`
    setQueue(queueId, { progress: ' OCR 识别' });
    const content = await ocr(`image/${filename}`)
    setQueue(queueId, { progress: ' AI 内容识别' });
    let desc = ''
    if (apiKey && markDescGen) {
      desc = await fetchAiDesc(content).then(res => res ? res.choices[0].message.content : content)
    } else {
      desc = content
    }
    const mark: Partial<Mark> = {
      tagId: currentTagId,
      type: 'image',
      content,
      url: filename,
      desc,
    }
    if (githubUsername) {
      setQueue(queueId, { progress: '上传至图床' });
      const res = await uploadFile({
        ext,
        file: uint8ArrayToBase64(file),
        filename,
        repo: RepoNames.image
      })
      if (res) {
        setQueue(queueId, { progress: '通知 jsdelivr 缓存' });
        await fetch(`https://purge.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res.data.content.name}`)
        mark.url = `https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${res.data.content.name}`
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
    <TooltipButton icon={<ImagePlus />} tooltipText="插图" onClick={selectImages} />
  )
}