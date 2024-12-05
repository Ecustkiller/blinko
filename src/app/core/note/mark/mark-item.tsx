import { delMark, Mark, MarkType, updateMark } from "@/db/marks";
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
import { LocalImage } from "@/components/local-image";
import { fetchAiDesc } from "@/lib/ai";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { ImageUp } from "lucide-react";

dayjs.extend(relativeTime)
dayjs.locale(zh)

function TextHover({text}: {text?: string}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="line-clamp-2 leading-4 mt-2 text-xs break-words hover:underline">{text}</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>{text}</p>
      </HoverCardContent>
    </HoverCard>
  )
}

function ImageViewer({mark, path}: {mark: Mark, path?: string}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <LocalImage
            src={mark.url.includes('http') ? mark.url : `/${path}/${mark.url}`}
            alt=""
            className="w-14 h-14 object-cover cursor-pointer"
          />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[1400px]">
        <SheetHeader>
          <SheetTitle>{MarkType[mark.type]}</SheetTitle>
          <span className="mt-4 text-xs text-zinc-500">创建于：{dayjs(mark.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          <LocalImage
            src={mark.url.includes('http') ? mark.url : `/${path}/${mark.url}`}
            alt=""
            className="w-full"
          />
          <SheetDescription>
            <span className="block my-4 text-md text-zinc-900 font-bold">描述</span>
            <span>{mark.desc}</span>
            <span className="block my-4 text-md text-zinc-900 font-bold">OCR</span>
            <span>{mark.content}</span>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export function MarkWrapper({mark}: {mark: Mark}) {
  switch (mark.type) {
    case 'scan':
    return (
      <div className="border-b flex p-2">
        <div className="pr-2 flex-1 overflow-hidden text-xs">
          <div className="flex w-full items-center gap-2 text-zinc-500">
            <span className="flex items-center gap-1 bg-cyan-900 text-white px-1 rounded">
              {MarkType[mark.type]}
            </span>
            <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
          </div>
          <TextHover text={mark.desc} />
        </div>
        <div className="bg-zinc-900 flex items-center justify-center">
          <ImageViewer mark={mark} path="screenshot" />
        </div>
      </div>
    )
    case 'image':
    return (
      <div className="border-b flex p-2">
        <div className="pr-2 flex-1 overflow-hidden text-xs">
          <div className="flex w-full items-center gap-2 text-zinc-500">
            <span className="flex items-center gap-1 bg-fuchsia-900 text-white px-1 rounded">
              {MarkType[mark.type]}
            </span>
            {mark.url.includes('http') ? <ImageUp className="size-3 text-zinc-400" /> : null}
            <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
          </div>
          <TextHover text={mark.desc} />
        </div>
        <div className="bg-zinc-900 flex items-center justify-center">
          <ImageViewer mark={mark} path="image" />
        </div>
      </div>
    )
    case 'text':
    default:
    return (
      <div className="border-b p-2">
        <div className="flex w-full items-center gap-2 text-zinc-500 text-xs">
          <span className="flex items-center gap-1 bg-lime-900 text-white px-1 rounded">
            {MarkType[mark.type]}
          </span>
          <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
        </div>
        <TextHover text={mark.content} />
      </div>
    )
  }
}

export function MarkItem({mark}: {mark: Mark}) {

  const { fetchMarks } = useMarkStore()
  const { tags, currentTagId, fetchTags, getCurrentTag } = useTagStore()

  async function handleDelMark() {
    await delMark(mark.id)
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
  }

  async function handleTransfer(tagId: number) {
    await updateMark({ ...mark, tagId })
    fetchMarks()
  }

  async function regenerateDesc() {
    const desc = await fetchAiDesc(mark.content || '').then(res => res.choices[0].message.content)
    await updateMark({ ...mark, desc })
    fetchMarks()
  }

  async function handelShowInFolder() {
    const appDir = await appDataDir()
    const path = mark.type === 'scan' ? 'screenshot' : 'image'
    invoke('show_in_folder', { path: `${appDir}/${path}/${mark.url}` })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <MarkWrapper mark={mark} />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>转移标签</ContextMenuSubTrigger>
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
        <ContextMenuItem inset disabled={mark.type === 'text'} onClick={regenerateDesc}>
          重新生成描述
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset disabled={mark.type === 'text'} onClick={handelShowInFolder}>
          查看原文件
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleDelMark}>
          <span className="text-red-900">删除</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
