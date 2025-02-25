'use client'
import { clear, hasImage, hasText, readImageBase64, readText } from "tauri-plugin-clipboard-api";
import { useEffect } from 'react';
import { BaseDirectory, exists, mkdir, writeFile } from '@tauri-apps/plugin-fs';
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { v4 as uuid } from "uuid";
import useChatStore from "@/stores/chat";
import useTagStore from "@/stores/tag";

export function ClipboardListener() {
  const { insert, chats, loading } = useChatStore()
  const { currentTagId } = useTagStore()

  async function readHandler() {
    if (loading) return
    const hasImageRes = await hasImage()
    const hasTextRes = await hasText()

    if (hasImageRes) {
      await handleImage()
    } else if (hasTextRes) {
      await handleText()
    }
  }

  async function handleImage() {
    const isClipboardFolderExists = await exists('clipboard', { baseDir: BaseDirectory.AppData})
    if (!isClipboardFolderExists) {
      await mkdir('clipboard', { baseDir: BaseDirectory.AppData })
    }
    const image = await readImageBase64()
    const uint8Array = Uint8Array.from(atob(image), c => c.charCodeAt(0))
    const path = `clipboard/${uuid()}.png`
    await writeFile(path, uint8Array, { baseDir: BaseDirectory.AppData })
    await clear()
    await insert({
      role: 'system',
      content: '',
      type: 'clipboard',
      image: `/${path}`,
      tagId: currentTagId,
      inserted: false
    })
  }

  async function handleText() {
    const text = await readText()
    const chatsContent = chats.map(item => item.content)
    if (!chatsContent.includes(text)) {
      await insert({
        role: 'system',
        content: text,
        type: 'clipboard',
        tagId: currentTagId,
        inserted: false
      })
    }
  }

  useEffect(() => {
    let unlisten: UnlistenFn;

    async function initListen() {
      unlisten = await listen('tauri://focus', readHandler)
    }
    initListen()

    return () => {
      if (unlisten) {
        unlisten()
      }
    }
  }, [currentTagId, chats.length, loading])

  return <></>
}