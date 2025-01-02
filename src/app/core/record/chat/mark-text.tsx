import { Chat } from "@/db/chats"
import { insertMark } from "@/db/marks"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { Highlighter } from "lucide-react"
 
export function MarkText({chat}: {chat: Chat}) {

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function handleSuccess() {
    const resetText = chat.content?.replace(/'/g, '')
    await insertMark({ tagId: currentTagId, type: 'text', desc: resetText, content: resetText })
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
  }

  return (
    <a className="flex items-center cursor-pointer gap-1 hover:underline" onClick={handleSuccess}>
      <Highlighter className="size-4" />
      记录
    </a>
  )
}