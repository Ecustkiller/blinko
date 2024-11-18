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
import { getTags, Tag } from "@/db/tags";
import React, { useEffect } from "react";
import emitter from "@/Emitter";
import { Store } from "@tauri-apps/plugin-store";

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
  const [tags, setTags] = React.useState<Tag[]>([])
  const [currentTag, setCurrentTag] = React.useState<Tag>()

  async function fetchTags() {
    const res = await getTags()
    setTags(res)
    const store = await Store.load('store.json');
    setCurrentTag(await store.get<Tag>('currentTag'))
  }

  async function handleDelMark() {
    await delMark(mark.id)
    fetchTags()
    emitter.emit('refresh-marks')
  }

  async function handleTransfer(tagId: number) {
    await updateMark({ ...mark, tagId })
    fetchTags()
    emitter.emit('refresh-marks')
  }

  useEffect(() => {
    fetchTags()
  }, [])

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
