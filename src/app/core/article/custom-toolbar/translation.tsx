import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchAi } from "@/lib/ai";
import { Languages } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { locales } from "@/lib/locales";
import useArticleStore from "@/stores/article";
import { toast } from "@/hooks/use-toast";
import { TooltipButton } from "@/components/tooltip-button";
import useSettingStore from "@/stores/setting";

export default function Translation({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  async function handleBlock(locale: string) {
    const selectedText = mdRef.current?.getSelectedText()
    if (selectedText) {
      setLoading(true)
      mdRef.current?.focus()
      const req = `将这段文字：${selectedText}，翻译为${locale}语言，直接返回翻译后的结果。`
      const res = await fetchAi(req)
      mdRef.current?.insert(() => ({
        targetValue: res,
      }))
      mdRef.current?.rerender();
      setLoading(false)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none" disabled={loading || !apiKey}>
        <div>
          <TooltipButton tooltipText="翻译" icon={<Languages />} disabled={loading || !apiKey} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>将选中的文本进行翻译</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            locales.map(item => (
              <DropdownMenuItem key={item} onClick={() => handleBlock(item)}>
                {item}
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}