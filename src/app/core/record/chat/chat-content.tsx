import useChatStore from '@/stores/chat'
import useTagStore from '@/stores/tag'
import { Bot, Clock, LoaderPinwheel, TypeIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Chat } from '@/db/chats'
import ChatPreview from './chat-preview'
import './chat.scss'
import { NoteOutput } from './note-output'
import { MarkText } from './mark-text'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import zh from "dayjs/locale/zh-cn";

dayjs.extend(relativeTime)
dayjs.locale(zh)

export default function ChatContent() {
  const { chats, init } = useChatStore()
  const { currentTagId } = useTagStore()

  useEffect(() => {
    if (chats.length === 0) {
      init(currentTagId)
    }
  }, [])

  useEffect(() => {
    const md = document.querySelector('#chats-wrapper')
    if (md) {
      md.scroll(0, md.scrollHeight)
      setTimeout(() => {
        md.scroll(0, md.scrollHeight)
      }, 500)
    }
  }, [chats])

  return <div id="chats-wrapper" className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col items-end p-4 gap-6">
    {
      chats.map((chat, index) => {
        return <Message key={index} chat={chat} />
      })
    }
  </div>
}

function MessageWrapper({ chat, children }: { chat: Chat, children: React.ReactNode }) {
  const { chats, loading } = useChatStore()
  const index = chats.findIndex(item => item.id === chat.id)
  if (chat.role === 'system') {
    return <div className="flex w-full gap-4">
      { loading && index === chats.length - 1 ? <LoaderPinwheel className="animate-spin" /> : <Bot />}
      <div className='text-sm leading-6 flex-1'>
        {children}
      </div>
    </div>
  } else {
    return <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
      {chat.content}
    </div>
  }
}

function Message({ chat }: { chat: Chat }) {


  switch (chat.type) {
    case 'clipboard-image':
      return <MessageWrapper chat={chat}>
        <ImageMessage image={chat.image} />
      </MessageWrapper>

    case 'note':
      return <MessageWrapper chat={chat}>
        <div className='w-full overflow-x-hidden'>
          <div className='flex justify-between'>
            <p>将你的记录整理为文章：</p>
          </div>
          <div className='note-wrapper border w-full overflow-y-auto overflow-x-hidden my-2 p-4 rounded-lg'>
            <ChatPreview text={chat.content || ''} />
          </div>
          <MessageControl chat={chat}>
            <NoteOutput chat={chat} />
          </MessageControl>
        </div>
      </MessageWrapper>
  
    default:
      return <MessageWrapper chat={chat}>
        <ChatPreview text={chat.content || ''} />
        <MessageControl chat={chat}>
          <MarkText chat={chat} />
        </MessageControl>
      </MessageWrapper>
  }
}

function MessageControl({chat, children}: {chat: Chat, children: React.ReactNode}) {
  const { loading } = useChatStore()
  if (!loading) {
    return <div className='flex items-center gap-4 h-4 my-1  text-zinc-500'>
      <p className='flex items-center gap-1'><Clock className='size-4' />{ dayjs(chat.createdAt).fromNow() }</p>
      <Separator orientation="vertical" />
      <p className='flex items-center gap-1'><TypeIcon className='size-4' />{ chat.content?.length } 字</p>
      <Separator orientation="vertical" />
      {children}
    </div>
  }
}

function ImageMessage({ image = '' }: { image?: string }) {
  return <div>
    <Image src={image} width={0} height={0} alt="clipboard image" className="w-full object-cover" />
  </div>
}