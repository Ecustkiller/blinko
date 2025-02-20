import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { Sparkles } from "lucide-react";
import Vditor from "vditor";

export default function Optimize({editor}: {editor?: Vditor}) {
  const { loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handleBlock() {
    const selectedText = editor?.getSelection()
    if (selectedText) {
      setLoading(true)
      editor?.focus()
      const req = `完善这段文字：${selectedText}，要求语言不变，注意这不是提问，直接返回优化后的结果。`
      const res = await fetchAi(req)
      editor?.updateValue(res)
      setLoading(false)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }
  return (
    <TooltipButton disabled={loading || !apiKey} icon={<Sparkles />} tooltipText="优化" onClick={handleBlock}>
    </TooltipButton>
  )
}