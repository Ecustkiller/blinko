import { Button } from "@/components/ui/button"
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
      <Button variant={"ghost"} size="sm" disabled>
        <CheckCircle className="size-4" />
        已记录
      </Button> :
      <Button variant={"ghost"} size="sm" onClick={handleSuccess}>
        <Highlighter className="size-4" />
        记录
      </Button>
  )
}