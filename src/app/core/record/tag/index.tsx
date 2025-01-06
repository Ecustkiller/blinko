"use client"

import * as React from "react"
import { ArrowUpDown, TagIcon, Lightbulb } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { TagItem } from './tag-item'
import { initTagsDb, insertTag, Tag } from "@/db/tags"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import useChatStore from "@/stores/chat"

export function TagManage() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState<string>("")
  const { init } = useChatStore()

  const {
    currentTag,
    tags,
    fetchTags,
    initTags,
    setCurrentTagId,
    getCurrentTag
  } = useTagStore()

  const { fetchMarks } = useMarkStore()

  async function quickAddTag() {
    const res = await insertTag({ name })
    await setCurrentTagId(res.lastInsertId as number)
    await fetchTags()
    getCurrentTag()
    setOpen(false)
    fetchMarks()
  }

  async function handleSelect(tag: Tag) {
    await setCurrentTagId(tag.id)
    getCurrentTag()
    setOpen(false)
    await fetchMarks()
    await init(tag.id)
  }

  React.useEffect(() => {
    const fetchData = async() => {
      await initTagsDb()
      await fetchTags()
      await initTags()
    }
    fetchData()
  }, [initTags, fetchTags])

  return (
    <>
      <div className="flex gap-1 w-full items-center justify-between px-2">
        <div
          className="w-full h-9 border cursor-pointer rounded flex justify-between items-center px-3 bg-white hover:bg-gray-50
            dark:bg-black dark:hover:bg-zinc-800"
          onClick={() => setOpen(true)}
        >
          <div className="flex gap-2 items-center">
            { name === '灵感' ? <Lightbulb className="size-4" /> : <TagIcon className="size-4" /> }
            <span className="text-xs">{currentTag?.name} ({currentTag?.total})</span>
          </div>
          <ArrowUpDown className="size-3" />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="创建或查询标签..." onValueChange={(name) => setName(name)} />
        <CommandList>
          <CommandEmpty>
            <p className="text-gray-600">未查询到相关标签</p>
            <Button className="mt-4" onClick={quickAddTag}>快速创建</Button>
          </CommandEmpty>
          <CommandGroup heading="置顶">
            {
              tags?.filter((tag) => tag.isPin).map((tag) => 
                <TagItem key={tag.id} tag={tag} onChange={fetchTags} onSelect={handleSelect.bind(null, tag)} />)
            }
          </CommandGroup>
          <CommandGroup heading="其他">
            {
              tags?.filter((tag) => !tag.isPin).map((tag) => 
                <TagItem key={tag.id} tag={tag} onChange={fetchTags} onSelect={handleSelect.bind(null, tag)} />)
            }
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
