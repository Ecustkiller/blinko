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
import { insertMark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { BaseDirectory, exists, mkdir, writeFile } from "@tauri-apps/plugin-fs"
import { ImagePlus } from "lucide-react"
import { useState } from "react"
 
export function ControlImage() {
  const [open, setOpen] = useState(false);

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const isImageFolderExists = await exists('image', { baseDir: BaseDirectory.AppData})
    if (!isImageFolderExists) {
      await mkdir('image', { baseDir: BaseDirectory.AppData})
    }
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`
    const data = new Uint8Array(await file.arrayBuffer())
    await writeFile(`image/${filename}`, data, { baseDir: BaseDirectory.AppData})
    const content = await ocr(`image/${filename}`)
    const desc = await fetchAiDesc(content).then(res => res.choices[0].message.content)
    await insertMark({ tagId: currentTagId, type: 'image', content, url: filename, desc })
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
    setOpen(false)
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