"use client"

import * as React from "react"
import {
  ArrowUpDown,
  Plus,
  TagIcon,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { NoteItem } from './note-item'
import { initTagsDb, insertTag, getTags, Tag } from "@/db/tags"

export function NoteManage() {
  const [tags, setTags] = React.useState<Tag[]>()
  const [open, setOpen] = React.useState(false)

  function handleAddTag() {
    insertTag({
      name: `新标签${new Date().getTime()}`,
    })
  }

  function handleGetTags () {
    getTags().then((res) => {
      console.log(res);
      setTags(res)
    })
  }

  React.useEffect(() => {
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
            <span className="text-xs">灵感</span>
          </div>
          <ArrowUpDown className="size-3" />
        </div>
        <Button variant="ghost" size="icon" onClick={handleAddTag}>
          <Plus />
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="查询标签..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="置顶">
            {
              tags?.filter((tag) => tag.isPin).map((tag) => <NoteItem key={tag.id} tag={tag} onChange={handleGetTags} />)
            }
          </CommandGroup>
          <CommandGroup heading="其他">
            {
              tags?.filter((tag) => !tag.isPin).map((tag) => <NoteItem key={tag.id} tag={tag} onChange={handleGetTags} />)
            }
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
