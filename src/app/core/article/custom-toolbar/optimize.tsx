import { TooltipButton } from "@/components/tooltip-button";
import { fetchAiStream } from "@/lib/ai";
import { Sparkles } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";

export default function Optimize({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  async function handleBlock() {
    mdRef.current?.focus()
    const selectedText = mdRef.current?.getSelectedText()
    const req = `完善这段文字：${selectedText}，注意这不是提问，直接返回优化后的结果。`
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
    <TooltipButton icon={<Sparkles />} tooltipText="优化" onClick={handleBlock}>
    </TooltipButton>
  )
}