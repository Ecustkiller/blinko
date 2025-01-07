import useChatStore from '@/stores/chat'
import useTagStore from '@/stores/tag'
import { Bot, LoaderPinwheel } from 'lucide-react'
import { useEffect } from 'react'
import { Chat } from '@/db/chats'
import ChatPreview from './chat-preview'
import './chat.scss'
import { NoteOutput } from './note-output'
import { MarkText } from './mark-text'
import { ChatClipboard } from './chat-clipboard'
import MessageControl from './message-control'
import ChatEmpty from './chat-empty'

export default function ChatContent() {
  const { chats, init } = useChatStore()
  const { currentTagId } = useTagStore()

  useEffect(() => {
    init(currentTagId)
  }, [currentTagId])

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
      chats.length ? chats.map((chat, index) => {
        return <Message key={index} chat={chat} />
      }) : <ChatEmpty />
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
    case 'clipboard':
      return <MessageWrapper chat={chat}>
        <ChatClipboard chat={chat} />
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
