import { TooltipButton } from "@/components/tooltip-button";
import { fetchAiStream } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import { ListPlus } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";

export default function Continue({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const { currentArticle, loading, setLoading } = useArticleStore()
  async function handler() {
    const index = mdRef.current?.getEditorView()?.state.selection.ranges[0].to;
    setLoading(true)
    mdRef.current?.focus()
    const startContent = currentArticle.slice(0, index);
    const endContent = currentArticle.slice(index, currentArticle.length);
    const req = `
      参考前文：${startContent}，
      在目前的位置上续写一些内容，直接返回结果，内容不要超过100字。
      可以参考后文：${endContent}，尽量不要于其重复。
    `
    let res = ''
    await fetchAiStream(req, text => {
      if (text === '[DONE]') return
      mdRef.current?.insert(() => ({
        targetValue: res += text,
      }))
    })
    setLoading(false)
  }
  return (
    <TooltipButton disabled={loading} icon={<ListPlus />} tooltipText="续写" onClick={handler}>
    </TooltipButton>
  )
}