import useChatStore from '@/stores/chat'
import useTagStore from '@/stores/tag'
import { Bot, LoaderPinwheel } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Chat } from '@/db/chats'
import NotePreview from './note-preview'
import './chat.scss'

export default function ChatWrapper() {
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

  return <div id="chats-wrapper" className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col p-4 gap-6">
    {
      chats.map((chat, index) => {
        return <Message key={index} chat={chat} />
      })
    }
  </div>
}

function Message({ chat }: { chat: Chat }) {
  const { chats, loading } = useChatStore()
  const index = chats.findIndex(item => item.id === chat.id)

  switch (chat.type) {
    case 'clipboard-image':
      return <ImageMessage image={chat.image} />
  
    default:
      return (
        <div className="flex w-full gap-4">
          { chat.role === 'system' && (
            loading && index === chats.length - 1 ? <LoaderPinwheel className="animate-spin" /> : <Bot />
          ) }
          <div className='text-sm leading-6 flex-1'>
            {
              chat.role === 'system' ? 
              <div className="">
                <NotePreview text={chat.content || ''} />
              </div> :
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg float-right">
                {chat.content}
              </div>
            }
          </div>
        </div>
      )
  }
}

function ImageMessage({ image = '' }: { image?: string }) {
  return <div>
    <Image src={image} width={0} height={0} alt="clipboard image" className="w-full object-cover" />
  </div>
}