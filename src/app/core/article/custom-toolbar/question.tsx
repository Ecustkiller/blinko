import { TooltipButton } from "@/components/tooltip-button";
import { toast } from "@/hooks/use-toast";
import { fetchAiStreamToken } from "@/lib/ai";
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
    const selection = document.getSelection()
    const rang = selection?.getRangeAt(0)
    const button = (editor?.vditor.toolbar?.elements?.question.childNodes[0] as HTMLButtonElement)
    button.classList.add('vditor-menu--disabled')
    const selectedText = rang?.startContainer.textContent;
    if (selectedText) {
      const req = `
        参考原文：${currentArticle}
        根据提问：${selectedText}，直接返回回答内容。
      `
      await fetchAiStreamToken(req, (text) => {
        editor?.insertValue(text, true)
      })
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
    button.classList.remove('vditor-menu--disabled')
  }

  useEffect(() => {
    emitter.on('toolbar-question', handleBlock)
  }, [])
  return (
    <TooltipButton disabled={!apiKey} icon={<MessageCircleQuestion />} tooltipText="问答" onClick={handleBlock}>
    </TooltipButton>
  )
}
