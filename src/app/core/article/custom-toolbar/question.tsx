import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { MessageCircleQuestion } from "lucide-react";
import Vditor from "vditor";

export default function Question({editor}: {editor?: Vditor}) {

  const { currentArticle, loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  
  async function handleBlock() {
    const selectedText = editor?.getSelection()
    if (selectedText) {
      setLoading(true)
      editor?.focus()
      const req = `
        参考原文：${currentArticle}
        根据提问：${selectedText}，直接返回回答内容。
      `
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
    <TooltipButton disabled={loading || !apiKey} icon={<MessageCircleQuestion />} tooltipText="问答" onClick={handleBlock}>
    </TooltipButton>
  )
}
