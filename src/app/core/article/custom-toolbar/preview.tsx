import { TooltipButton } from "@/components/tooltip-button";
import { SquareMIcon, SquareSplitHorizontal, ViewIcon } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject, useState } from "react";

export default function Preview({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const previewTypes = [
    {type: 'code', name: '编辑模式', icon: <SquareMIcon />},
    {type: 'preview', name: '分屏模式', icon: <SquareSplitHorizontal />},
    {type: 'preview-only', name: '预览模式', icon: <ViewIcon />},
  ]

  const [type, setType] = useState(0)

  async function handler() {
    let cacheType = type
    if (type < previewTypes.length - 1) {
      setType(type + 1)
      cacheType += 1
    } else {
      setType(0)
      cacheType = 0
    }
    switch (cacheType) {
      case 0:
        mdRef.current?.togglePreview(false)
        break;
      case 1:
        mdRef.current?.togglePreview(true)
        break;
      case 2:
        mdRef.current?.togglePreviewOnly(true)
        break;
      default:
        break;
    }
    mdRef.current?.focus()
  }
  return (
    <TooltipButton icon={previewTypes[type].icon} tooltipText={previewTypes[type].name} onClick={handler}>
    </TooltipButton>
  )
}