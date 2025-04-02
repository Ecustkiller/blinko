import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAiStreamToken } from "@/lib/ai";
import emitter from "@/lib/emitter";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import Vditor from "vditor";

export default function Polish({editor}: {editor?: Vditor}) {
  const { loading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handler() {
    const button = (editor?.vditor.toolbar?.elements?.polish.childNodes[0] as HTMLButtonElement)
    button.classList.add('vditor-menu--disabled')
    const selectedText = editor?.getSelection()
    if (selectedText) {
      const req = `润色这段文字：${selectedText}，要求语言不变，修复错别字和病句，直接返回润色后的结果。`
      await fetchAiStreamToken(req, (text) => {
        editor?.updateValue(text)
      })
      editor?.focus()
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
    button.classList.remove('vditor-menu--disabled')
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