"use client"

import * as React from "react"
import { ArrowUpDown, TagIcon } from "lucide-react"
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
import { initTagsDb, insertTag, getTags, Tag } from "@/db/tags"
import { Store } from '@tauri-apps/plugin-store';

export function NoteManage() {
  const [tags, setTags] = React.useState<Tag[]>()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState<string>("")

  async function initCurrentTag() {
    const store = await Store.load('store.json');
    const currentTag = await store.get<Tag>('currentTag')
    if (currentTag) {
      setName(currentTag.name)
    }
  }

  async function quickAddTag() {
    await insertTag({ name })
    setOpen(false)
  }

  function handleGetTags () {
    getTags().then((res) => {
      console.log(res);
      setTags(res)
    })
  }

  async function handleSelect(tag: Tag) {
    const store = await Store.load('store.json');
    store.set('currentTag', tag)
    setName(tag.name)
    setOpen(false)
  }

  React.useEffect(() => {
    initCurrentTag()
    initTagsDb()
  }, [])

  React.useEffect(() => {
    if (open) {
      handleGetTags();
    } 
  }, [open])

  return (
    <>
      <div className="flex gap-1 w-full items-center justify-between">
        <div
          className="w-full h-9 border cursor-pointer rounded flex justify-between items-center px-3 bg-white hover:bg-gray-50
            dark:bg-black dark:hover:bg-zinc-800"
          onClick={() => setOpen(true)}
        >
          <div className="flex gap-2 items-center">
            <TagIcon className="size-4" />
            <span className="text-xs">{name}</span>
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
                <TagItem key={tag.id} tag={tag} onChange={handleGetTags} onSelect={handleSelect.bind(null, tag)} />)
            }
          </CommandGroup>
          <CommandGroup heading="其他">
            {
              tags?.filter((tag) => !tag.isPin).map((tag) => 
                <TagItem key={tag.id} tag={tag} onChange={handleGetTags} onSelect={handleSelect.bind(null, tag)} />)
            }
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
