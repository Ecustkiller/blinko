import { Separator } from "@/components/ui/separator"
import { Chat } from "@/db/chats"
import useChatStore from "@/stores/chat"
import dayjs from "dayjs"
import { Clock, Trash, TypeIcon } from "lucide-react"
import relativeTime from "dayjs/plugin/relativeTime";
import zh from "dayjs/locale/zh-cn";
import wordsCount from 'words-count';

dayjs.extend(relativeTime)
dayjs.locale(zh)

export default function MessageControl({chat, children}: {chat: Chat, children: React.ReactNode}) {
  const { loading } = useChatStore()
  const count = wordsCount(chat.content || '')
  const { deleteChat } = useChatStore()
  
  function deleteHandler() {
    deleteChat(chat.id)
  }

  if (!loading) {
    return <div className='flex items-center gap-4 h-4 my-1  text-zinc-500'>
      <p className='flex items-center gap-1'><Clock className='size-4' />{ dayjs(chat.createdAt).fromNow() }</p>
      <Separator orientation="vertical" />
      {
        count ? <>
          <p className='flex items-center gap-1'><TypeIcon className='size-4' />
            { count } 字
          </p>
          <Separator orientation="vertical" /> 
        </> : null
      }
      {children}
      {
        chat.type !== "chat" && 
        <>
          <Separator orientation="vertical" />
          <p className='flex items-center gap-1 cursor-pointer hover:underline' onClick={deleteHandler}>
            <Trash className='size-4' />删除
          </p>
        </>
      }
    </div>
  }
}
