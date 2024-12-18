import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAiStream } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import { BotMessageSquare } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";

export default function Ai({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const { currentArticle, loading, setLoading } = useArticleStore()
  async function handleBlock() {
    const selectedText = mdRef.current?.getSelectedText()
    if (selectedText) {
      setLoading(true)
      mdRef.current?.focus()
      const req = `
        参考原文：${currentArticle}
        根据需求：${selectedText}，如果是问题回答问题，如果不是，则根据内容生成一段内容，直接返回结果。
      `
      let res = ''
      await fetchAiStream(req, text => {
        if (text === '[DONE]') return
        mdRef.current?.insert(() => ({
          targetValue: res += text,
        }))
      })
      setLoading(false)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }
  return (
    <TooltipButton disabled={loading} icon={<BotMessageSquare />} tooltipText="AI" onClick={handleBlock}>
    </TooltipButton>
  )
}