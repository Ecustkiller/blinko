'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { extractTitle } from "@/lib/markdown"
import useTagStore from "@/stores/tag"
import { CheckedState } from "@radix-ui/react-checkbox"
import { BaseDirectory, readDir, writeTextFile } from "@tauri-apps/plugin-fs"
import { Store } from "@tauri-apps/plugin-store"
import { SquarePen, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { redirect } from 'next/navigation'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chat } from "@/db/chats"
 
export function NoteOutput({chat}: {chat: Chat}) {
  const { deleteTag, currentTagId } = useTagStore()
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('')
  const [path, setPath] = useState('/')
  const [folders, setFolders] = useState<string[]>([])
  const [isRemove, setIsRemove] = useState<CheckedState>(true)

  async function handleTransform() {
    const content = decodeURIComponent(chat?.content || '')
    const writeTo = `article${path}/${title.replace(/ /g, '_')}`
    await writeTextFile(writeTo, content, { baseDir: BaseDirectory.AppData })
    const store = await Store.load('store.json');
    await store.set('activeFilePath', title)
    if (isRemove) {
      deleteTag(currentTagId)
    }
    setOpen(false)
    redirect('/core/article')
  }

  async function readArticleDir() {
    const dirs = (await readDir('article', { baseDir: BaseDirectory.AppData })).filter(dir => dir.isDirectory).map(dir => `/${dir.name}`)
    setFolders(dirs)
  }

  useEffect(() => {
    setIsRemove(chat?.tagId !== 1)
    setTitle(extractTitle(chat?.content || '') + '.md')
    readArticleDir()
  }, [chat])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a className="font-bold text-blue-500 cursor-pointer flex items-center gap-1 hover:underline">
          <SquarePen className="size-4" />
          在写作中继续编辑
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>转化文章</DialogTitle>
          <DialogDescription>
            当前的笔记是由 AI 生成且无法编辑，将当前笔记转化为文章（生成本地文件），可在写作页面中进行二次创作。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Label>文件名</Label>
          <div className="flex border rounded-lg">
            <Select value={path} onValueChange={setPath}>
              <SelectTrigger className="w-[180px] border-none outline-none">
                <SelectValue placeholder="选择文件夹" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="/">根目录</SelectItem>
                  {
                    folders.map((folder, index) => {
                      return <SelectItem key={index} value={folder}>{folder}</SelectItem>
                    })
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input className="border-none" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox disabled={chat?.tagId === 1} id="terms" checked={isRemove} onCheckedChange={value => setIsRemove(value)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              删除当前标签、记录和笔记（回收站可恢复）
            </label>
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center justify-end gap-2 pt-4">
            <p className="text-xs text-zinc-400 flex items-center gap-1"><TriangleAlert className="size-4" />转换后将跳转到写作页面。</p>
            <Button type="submit" onClick={handleTransform}>转化</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}