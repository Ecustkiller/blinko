import { TooltipButton } from "@/components/tooltip-button";
import { fetchAi } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import useSettingStore from "@/stores/setting";
import { SquareActivity } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { cursorDocEnd, insertNewline, blockComment } from "@codemirror/commands";

export default function Check({editor}: {editor?: Vditor}) {

  const { currentArticle, loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handler() {
    setLoading(true)
    editor?.focus()
    const codemirror = mdRef.current?.getEditorView()
    if (!codemirror) return
    cursorDocEnd(codemirror)
    insertNewline(codemirror)
    insertNewline(codemirror)
    const req = `
      文章内容：
      ${currentArticle}
      帮我对这篇文章进行评分，并指出其中的不足和需要改进的地方，按照以下的模板进行输出：
      首先按照评分格式进行输出：
      评分: 85/100
      其次按照进行输出，以下是要求：
      文章中主要存在的问题，并给出改进建议（包括具体位置)
      文章中可能存在的错别字、用词不当、语法错误等问题，并给出改进建议（包括具体位置）
      最后再给出文章的整体分析
      注意不要使用 markdown 语法进行输出
    `
    const res = (await fetchAi(req))

    editor?.insertValue(res)

    blockComment(codemirror)
    setLoading(false)
  }
  return (
    <TooltipButton disabled={loading || !apiKey} icon={<SquareActivity />} tooltipText="分析" onClick={handler}>
    </TooltipButton>
  )
}