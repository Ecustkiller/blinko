"use client"

import * as React from "react"
import {
  ArrowUpDown,
  Plus,
  Tag,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { NoteItem } from './note-item'

export function NoteManage() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <div className="flex gap-1 w-full items-center justify-between">
        <div
          className="w-full h-9 border cursor-pointer rounded flex justify-between items-center px-3 bg-white hover:bg-gray-50
            dark:bg-black dark:hover:bg-zinc-800"
          onClick={() => setOpen(true)}
        >
          <div className="flex gap-2 items-center">
            <Tag className="size-4" />
            <span className="text-xs">灵感</span>
          </div>
          <ArrowUpDown className="size-3" />
        </div>
        <Button variant="ghost" size="icon">
          <Plus />
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="查询标签..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="置顶">
            <CommandItem>
              <NoteItem title="灵感" isLocked />
            </CommandItem>
            <CommandItem>
              <NoteItem title="Tag 1" isPin />
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="其他">
            <CommandItem>
              <NoteItem title="Tag 2" />
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
