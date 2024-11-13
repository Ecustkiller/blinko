import { Badge } from "@/components/ui/badge"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Lock, Pin, Tag } from "lucide-react"

function ItemIcon({ isLocked=false, isPin=false }) {
  if (isLocked) {
    return <Lock className="scale-75 text-gray-500" />
  } else {
    if (isPin) {
      return <Pin className="scale-75 text-gray-500" />
    } else {
      return <Tag className="scale-75 text-gray-500" />
    }
  }
}

export function NoteItem({ title="灵感", isLocked=false, isPin=false, total=0 }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex justify-between items-center w-full">
        <div className="flex gap-2">
          <ItemIcon isLocked={isLocked} isPin={isPin} />
          <span>{ title }</span>
        </div>
        <Badge variant="outline">{ total }</Badge>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset disabled={isLocked || isPin}>
          置顶
        </ContextMenuItem>
        <ContextMenuItem inset disabled={isLocked}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
