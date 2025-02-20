import { TooltipButton } from "@/components/tooltip-button";
import { fetchAi } from "@/lib/ai";
import emitter from "@/lib/emitter";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { ListPlus } from "lucide-react";
import { useEffect } from "react";
import Vditor from "vditor";

export default function Continue({editor}: {editor?: Vditor}) {

  const { loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handler() {
    const content = editor?.getValue()
    editor?.focus()
    if (!content) return
    const currentLineContent = editor?.vditor.ir?.range?.startContainer.nodeValue || ''
    const currentCursorIndex = content?.indexOf(currentLineContent) + currentLineContent.length
    setLoading(true)
    const startContent = content.slice(0, currentCursorIndex);
    const endContent = content.slice(currentCursorIndex, content.length);
    const req = `
      参考前文：
      --- 前文开始 ---
      ${startContent}，
      --- 前文结束 ---

      参考后文：
      -- 后文开始 --
      ${endContent}
      -- 后文结束 --

      要求在前文和后文中间续写一些内容，直接返回结果，内容不要超过100字。
      不要与前文或后文内容出现重复的内容。
    `
    const res = await fetchAi(req)
    editor?.insertValue(res)
    setLoading(false)
  }

  useEffect(() => {
    emitter.on('toolbar-continue', handler)
  }, [])

  return (
    <TooltipButton disabled={loading || !apiKey} icon={<ListPlus />} tooltipText="续写" onClick={handler}>
    </TooltipButton>
  )
}