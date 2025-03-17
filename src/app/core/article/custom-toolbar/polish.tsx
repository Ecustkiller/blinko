import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import emitter from "@/lib/emitter";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import Vditor from "vditor";

export default function Polish({editor}: {editor?: Vditor}) {
  const { loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handler() {
    const selectedText = editor?.getSelection()
    if (selectedText) {
      setLoading(true)
      const req = `润色这段文字：${selectedText}，要求语言不变，修复错别字和病句，直接返回润色后的结果。`
      const res = await fetchAi(req)
      setLoading(false)
      editor?.focus()
      setTimeout(() => {
        editor?.updateValue(res)
      }, 0);
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    emitter.on('toolbar-polish', handler)
    return () => {
      emitter.off('toolbar-polish', handler)
    }
  }, [])

  return (
    <TooltipButton disabled={loading || !apiKey} icon={<Sparkles />} tooltipText="优化" onClick={handler}>
    </TooltipButton>
  )
}