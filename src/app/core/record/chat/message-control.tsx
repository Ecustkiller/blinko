import { Separator } from "@/components/ui/separator"
import { Chat } from "@/db/chats"
import useChatStore from "@/stores/chat"
import dayjs from "dayjs"
import { Clock, TypeIcon, XIcon } from "lucide-react"
import relativeTime from "dayjs/plugin/relativeTime";
import zh from "dayjs/locale/zh-cn";
import wordsCount from 'words-count';
import { Button } from "@/components/ui/button"

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
    return <div className='flex items-center gap-1 -translate-x-3'>
      <Button variant={"ghost"} size="sm" disabled>
        <Clock className="size-4" />
        { dayjs(chat.createdAt).fromNow() }
      </Button>
      <Separator orientation="vertical" className="h-4" />
      {
        count ? <>
          <Button variant={"ghost"} size="sm" disabled>
            <TypeIcon className="size-4" />
            { count } 字
          </Button>
          <Separator orientation="vertical" className="h-4" /> 
        </> : null
      }
      {children}
      {
        chat.type !== "chat" && 
        <>
          <Separator orientation="vertical" className="h-4" />
          <Button variant={"ghost"} size={"icon"} onClick={deleteHandler}>
            <XIcon className='size-4' />
          </Button>
        </>
      }
    </div>
  }
}
