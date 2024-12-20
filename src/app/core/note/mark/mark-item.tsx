'use client'
import { delMark, Mark, MarkType, restoreMark, updateMark } from "@/db/marks";
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
import React, { useEffect, useState } from "react";
import useMarkStore from "@/stores/mark";
import useTagStore from "@/stores/tag";
import { LocalImage } from "@/components/local-image";
import { fetchAiDesc } from "@/lib/ai";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { ImageUp } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { convertImage } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";


dayjs.extend(relativeTime)
dayjs.locale(zh)

function ImageViewer({mark, path}: {mark: Mark, path?: string}) {
  const [src, setSrc] = useState('')

  async function init() {
    const res = mark.url.includes('http') ? mark.url : await convertImage(`/${path}/${mark.url}`)
    setSrc(res)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <PhotoProvider>
      <PhotoView src={src}>
        <div>
          <LocalImage
            src={mark.url.includes('http') ? mark.url : `/${path}/${mark.url}`}
            alt=""
            className="w-14 h-14 object-cover cursor-pointer"
          />
        </div>
      </PhotoView>
    </PhotoProvider>
  )
}

function DetailViewer({mark, content, path}: {mark: Mark, content: string, path?: string}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span className="line-clamp-2 leading-4 mt-2 text-xs break-words cursor-pointer hover:underline">{content}</span>
      </SheetTrigger>
      <SheetContent className="min-w-[400px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{MarkType[mark.type]}</SheetTitle>
          <span className="mt-4 text-xs text-zinc-500">创建于：{dayjs(mark.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        </SheetHeader>
        <div className="h-[calc(100vh-88px)] overflow-y-auto p-4">
          {
            mark.url ?
            <LocalImage
              src={mark.url.includes('http') ? mark.url : `/${path}/${mark.url}`}
              alt=""
              className="w-full"
            /> :
            null
          }
          <SheetDescription>
            <span className="block my-4 text-md text-zinc-900 font-bold">描述</span>
            <span className="leading-6">{mark.desc}</span>
            {
              mark.type === 'text' ? null :
              <>
                <span className="block my-4 text-md text-zinc-900 font-bold">OCR</span>
                <span className="leading-6">{mark.content}</span>
              </>
            }
          </SheetDescription>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function MarkWrapper({mark}: {mark: Mark}) {
  switch (mark.type) {
    case 'scan':
    return (
      <div className="flex p-2">
        <div className="pr-2 flex-1 overflow-hidden text-xs">
          <div className="flex w-full items-center gap-2 text-zinc-500">
            <span className="flex items-center gap-1 bg-cyan-900 text-white px-1 rounded">
              {MarkType[mark.type]}
            </span>
            <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
          </div>
          <DetailViewer mark={mark} content={mark.desc || ''} />
        </div>
        <div className="bg-zinc-900 flex items-center justify-center">
          <ImageViewer mark={mark} path="screenshot" />
        </div>
      </div>
    )
    case 'image':
    return (
      <div className="flex p-2">
        <div className="pr-2 flex-1 overflow-hidden text-xs">
          <div className="flex w-full items-center gap-2 text-zinc-500">
            <span className="flex items-center gap-1 bg-fuchsia-900 text-white px-1 rounded">
              {MarkType[mark.type]}
            </span>
            {mark.url.includes('http') ? <ImageUp className="size-3 text-zinc-400" /> : null}
            <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
          </div>
          <DetailViewer mark={mark} content={mark.desc || ''} />
        </div>
        <div className="bg-zinc-900 flex items-center justify-center">
          <ImageViewer mark={mark} path="image" />
        </div>
      </div>
    )
    case 'text':
    default:
    return (
      <div className="p-2 flex-1">
        <div className="flex w-full items-center gap-2 text-zinc-500 text-xs">
          <span className="flex items-center gap-1 bg-lime-900 text-white px-1 rounded">
            {MarkType[mark.type]}
          </span>
          <span className="ml-auto text-xs">{dayjs(mark.createdAt).fromNow()}</span>
        </div>
        <DetailViewer mark={mark} content={mark.content || ''} />
      </div>
    )
  }
}

export function MarkItem({mark}: {mark: Mark}) {

  const { fetchMarks, trashState, fetchAllTrashMarks } = useMarkStore()
  const { tags, currentTagId, fetchTags, getCurrentTag } = useTagStore()

  async function handleDelMark() {
    await delMark(mark.id)
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
  }

  async function handleRestore() {
    await restoreMark(mark.id)
    if (trashState) {
      await fetchAllTrashMarks()
    } else {
      await fetchMarks()
    }
  }

  async function handleTransfer(tagId: number) {
    await updateMark({ ...mark, tagId })
    await fetchTags()
    getCurrentTag()
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

  async function handleCopyLink() {
    await navigator.clipboard.writeText(mark.url)
    toast({
      title: '已复制到剪切板'
    })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="border-b">
          <MarkWrapper mark={mark} />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {
          trashState ? null :
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
        }
        <ContextMenuItem inset disabled>
          转换为{mark.type === 'scan' ? '插图' : '截图'}
        </ContextMenuItem>
        <ContextMenuItem inset disabled={!mark.url} onClick={handleCopyLink}>
          复制链接
        </ContextMenuItem>
        <ContextMenuItem inset disabled={mark.type === 'text'} onClick={regenerateDesc}>
          重新生成描述
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset disabled={mark.type === 'text'} onClick={handelShowInFolder}>
          查看原文件
        </ContextMenuItem>
        {
          trashState ? 
          <ContextMenuItem inset onClick={handleRestore}>
            <span className="text-red-900">还原</span>
          </ContextMenuItem> :
          <ContextMenuItem inset onClick={handleDelMark}>
            <span className="text-red-900">删除</span>
          </ContextMenuItem>
        }
      </ContextMenuContent>
    </ContextMenu>
  )
}
