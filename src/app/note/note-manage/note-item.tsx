import { Badge } from "@/components/ui/badge"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Lock, Pin, TagIcon } from "lucide-react"
import { delTag, Tag, updateTag } from "@/db/tags"
import { CommandItem } from "@/components/ui/command"

function ItemIcon({ isLocked=false, isPin=false }) {
  if (isLocked) {
    return <Lock className="scale-75 text-gray-500" />
  } else {
    if (isPin) {
      return <Pin className="scale-75 text-gray-500" />
    } else {
      return <TagIcon className="scale-75 text-gray-500" />
    }
  }
}

export function NoteItem({ tag, onChange }: { tag: Tag, onChange: () => void }) {

  async function handleDel() {
    await delTag(tag.id)
    onChange()
  }

  async function togglePin() {
    await updateTag({ ...tag, isPin: !tag.isPin })
    onChange()
  }

  return (
    <CommandItem>
      <ContextMenu>
        <ContextMenuTrigger className="flex justify-between items-center w-full">
          <div className="flex gap-2">
            <ItemIcon isLocked={tag.isLocked} isPin={tag.isPin} />
            <span>{ tag.name }</span>
          </div>
          <Badge variant="outline">{ tag.total }</Badge>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset disabled={tag.isLocked} onClick={togglePin}>
            { tag.isPin ? "取消置顶" : "置顶" }
          </ContextMenuItem>
          <ContextMenuItem inset disabled={tag.isLocked} onClick={handleDel}>
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </CommandItem>
  )
}
