import { Link, Unlink } from "lucide-react"
 
import { Toggle } from "@/components/ui/toggle"
import useMarkStore from '@/stores/mark'
import useTagStore from "@/stores/tag"
import useChatStore from "@/stores/chat"

export function ChatLink({ inputType }: { inputType?: string }) {
  const { currentTag } = useTagStore()
  const { marks } = useMarkStore()
  const { isLinkMark, setIsLinkMark } = useChatStore()

  return (
    <Toggle size="sm" disabled={marks.length === 0 || inputType === 'gen'} pressed={isLinkMark} onPressedChange={setIsLinkMark}>
      {
        isLinkMark ? <Link /> : <Unlink />
      }
      {currentTag?.name} ({marks.length})
    </Toggle>
  )
}