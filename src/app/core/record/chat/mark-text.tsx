import { Chat } from "@/db/chats"
import { insertMark } from "@/db/marks"
import useChatStore from "@/stores/chat"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { CheckCircle, Highlighter } from "lucide-react"
 
export function MarkText({chat}: {chat: Chat}) {

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()
  const { updateInsert } = useChatStore()

  async function handleSuccess() {
    const resetText = chat.content?.replace(/'/g, '')
    await insertMark({ tagId: currentTagId, type: 'text', desc: resetText, content: resetText })
    updateInsert(chat.id)
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
  }

  return (
    chat.inserted ? 
      <p className="flex gap-1 items-center"><CheckCircle className="size-4" />已记录</p> :
      <a className="flex items-center cursor-pointer gap-1 hover:underline" onClick={handleSuccess}>
        <Highlighter className="size-4" />
        记录
      </a>
  )
}