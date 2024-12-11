import { TooltipButton } from "@/components/tooltip-button";
import { fetchAiStream } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import { BotMessageSquare } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";

export default function Ai({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const { currentArticle } = useArticleStore()
  async function handleBlock() {
    mdRef.current?.focus()
    const selectedText = mdRef.current?.getSelectedText()
    const req = `
      参考原文：${currentArticle}
      根据需求：${selectedText}，如果是问题回答问题，如果不是，则根据内容生成文章，直接返回结果。
    `
    let res = ''
    await fetchAiStream(req, text => {
      if (text === '[DONE]') return
      mdRef.current?.insert(() => ({
        targetValue: res += text,
      }))
      mdRef.current?.rerender();
    })
  }
  return (
    <TooltipButton icon={<BotMessageSquare />} tooltipText="AI" onClick={handleBlock}>
    </TooltipButton>
  )
}