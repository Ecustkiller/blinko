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
    editor?.disabled()
    const selection = document.getSelection()
    const rang = selection?.getRangeAt(0)
    const button = (editor?.vditor.toolbar?.elements?.question.childNodes[0] as HTMLButtonElement)
    const selectedText = rang?.startContainer.textContent;
    if (selectedText) {
      const req = `
        参考原文：${currentArticle}
        根据提问：${selectedText}，直接返回回答内容。
      `
      const res = await fetchAi(req)
      editor?.insertEmptyBlock("beforeend")
      editor?.insertValue(res)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
    button.classList.remove('vditor-menu--disabled')
    editor?.enable()
  }

  useEffect(() => {
    emitter.on('toolbar-question', handleBlock)
  }, [])
  return (
    <TooltipButton disabled={!apiKey} icon={<MessageCircleQuestion />} tooltipText="问答" onClick={handleBlock}>
    </TooltipButton>
  )
}
