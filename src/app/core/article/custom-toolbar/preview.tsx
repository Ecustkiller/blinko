import { SquareMIcon, SquareSplitHorizontal, ViewIcon } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Preview({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const previewTypes = [
    {type: 'code', name: '编辑模式', icon: <SquareMIcon className="size-4" />},
    {type: 'preview', name: '分屏模式', icon: <SquareSplitHorizontal className="size-4" />},
    {type: 'preview-only', name: '预览模式', icon: <ViewIcon className="size-4" />},
  ]

  async function handler(tab: string) {
    switch (tab) {
      case 'code':
        mdRef.current?.togglePreview(false)
        break;
      case 'preview':
        mdRef.current?.togglePreview(true)
        break;
      case 'preview-only':
        mdRef.current?.togglePreviewOnly(true)
        break;
      default:
        break;
    }
    mdRef.current?.focus()
  }
  return (
    <Tabs defaultValue="code" className="mx-2" onValueChange={handler}>
      <TabsList className="grid w-full grid-cols-3 gap-0.5">
        {
          previewTypes.map((item, index) => (
            <TabsTrigger className="p-1.5" key={index} value={item.type}>
              {item.icon}
            </TabsTrigger>
          ))
        }
      </TabsList>
    </Tabs>
  )
}