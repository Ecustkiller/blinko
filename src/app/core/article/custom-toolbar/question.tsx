import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAi } from "@/lib/ai";
import emitter from "@/lib/emitter";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { MessageCircleQuestion } from "lucide-react";
import { useEffect } from "react";
import Vditor from "vditor";

export default function Question({editor}: {editor?: Vditor}) {

  const { currentArticle } = useArticleStore()
  const { apiKey } = useSettingStore()
  
  async function handleBlock() {
    const selectedText = editor?.getSelection()
    if (selectedText) {
      const req = `
        参考原文：${currentArticle}
        根据提问：${selectedText}，直接返回回答内容。
      `
      const res = await fetchAi(req)
      editor?.updateValue(res)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    emitter.on('toolbar-question', handleBlock)
  }, [])
  return (
    <TooltipButton disabled={!apiKey} icon={<MessageCircleQuestion />} tooltipText="问答" onClick={handleBlock}>
    </TooltipButton>
  )
}
