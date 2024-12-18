import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAiStream } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import { Sparkles } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";

export default function Optimize({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { loading, setLoading } = useArticleStore()
  async function handleBlock() {
    const selectedText = mdRef.current?.getSelectedText()
    if (selectedText) {
      setLoading(true)
      mdRef.current?.focus()
      const req = `完善这段文字：${selectedText}，要求语言不变，注意这不是提问，直接返回优化后的结果。`
      let res = ''
      await fetchAiStream(req, text => {
        if (text === '[DONE]') return
        mdRef.current?.insert(() => ({
          targetValue: res += text,
        }))
        mdRef.current?.rerender();
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
    <TooltipButton disabled={loading} icon={<Sparkles />} tooltipText="优化" onClick={handleBlock}>
    </TooltipButton>
  )
}