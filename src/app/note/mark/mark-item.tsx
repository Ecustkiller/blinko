import { delMark, Marks, MarkType, updateMark } from "@/db/marks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSeparator,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import React from "react";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";

dayjs.extend(relativeTime)

export function MarkWrapper({mark}: {mark: Marks}) {
  return (
    <div className="p-4 border-b">
      <div className="flex w-full items-center gap-2">
        <span>{MarkType[mark.type]}</span>
        <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
      </div>
      <div className="flex w-full items-center gap-2">
        <span>{mark.desc}</span>
      </div>
    </div>
  )
}

export function MarkItem({mark}: {mark: Marks}) {

  const { fetchMarks } = useMarkStore()
  const { tags, currentTag } = useTagStore()

  async function handleDelMark() {
    await delMark(mark.id)
    fetchMarks()
  }

  async function handleTransfer(tagId: number) {
    await updateMark({ ...mark, tagId })
    fetchMarks()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <MarkWrapper mark={mark} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>转移</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {
              tags?.filter(tag => tag.id !== currentTag?.id).map((tag) => (
                <ContextMenuItem key={tag.id} onClick={() => handleTransfer(tag.id)}>{tag.name}</ContextMenuItem>
              ))
            }
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem inset disabled>
          转换为{mark.type === 'scan' ? '插图' : '截图'}
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          查看原文件
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={handleDelMark}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
