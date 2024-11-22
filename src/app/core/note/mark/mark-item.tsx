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
import zh from 'dayjs/locale/zh'
import React from "react";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";
import Image from 'next/image'
import { LocalImage } from "@/components/local-image";

dayjs.extend(relativeTime)
dayjs.locale(zh)

export function MarkWrapper({mark}: {mark: Marks}) {
  switch (mark.type) {
    case 'scan':
    return (
      <div className="border-b flex p-2">
        <div className="pr-2 flex-1 overflow-hidden text-xs">
          <div className="flex w-full items-center gap-2 text-zinc-500">
            <span className="bg-cyan-500  text-white px-1 rounded">{MarkType[mark.type]}</span>
            <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
          </div>
          <span className="line-clamp-2 leading-4 mt-2 text-xs break-words">{mark.content}</span>
        </div>
        <div className="bg-zinc-900 flex items-center justify-center">
          <LocalImage
            src={`/screenshot/${mark.url}`}
            alt=""
            className="w-14 h-14 object-cover cursor-pointer"
          />
        </div>
      </div>
    )
    case 'image':
    return (
      <div className="p-4 border-b">
        <div className="flex w-full items-center gap-2">
          <span>{MarkType[mark.type]}</span>
          <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
        </div>
        <div className="flex w-full items-center gap-2">
          <Image src={mark.type} width={100} height={100} alt="mark" />
        </div>
      </div>
    )
    case 'text':
    default:
    return (
      <div className="border-b p-2">
        <div className="flex w-full items-center gap-2 text-zinc-500 text-xs">
          <span className="flex items-center gap-1 bg-lime-500 text-white px-1 rounded">{MarkType[mark.type]}</span>
          <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
        </div>
        <span className="line-clamp-2 leading-4 mt-2 text-xs break-words">{mark.content}</span>
      </div>
    )
  }
}

export function MarkItem({mark}: {mark: Marks}) {

  const { fetchMarks } = useMarkStore()
  const { tags, currentTagId } = useTagStore()

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
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>转移</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {
              tags.map((tag) => (
                <ContextMenuItem disabled={tag.id === currentTagId} key={tag.id} onClick={() => handleTransfer(tag.id)}>
                  {tag.name}
                </ContextMenuItem>
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
          <span className="text-rose-600">删除</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
