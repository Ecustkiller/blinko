import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchAi } from "@/lib/ai";
import { useEffect, useState } from "react";
import emitter from "@/lib/emitter";
import { Languages } from "lucide-react";
import { locales } from "@/lib/locales";
import useArticleStore from "@/stores/article";
import { toast } from "@/hooks/use-toast";
import { TooltipButton } from "@/components/tooltip-button";
import useSettingStore from "@/stores/setting";
import Vditor from "vditor";

export default function Translation({editor}: {editor?: Vditor}) {
  const [open, setOpen] = useState(false)
  const { loading, setLoading } = useArticleStore()
  const { apiKey } = useSettingStore()
  const [selectedText, setSelectedText] = useState('')
  const [range, setRange] = useState<Range | null>(null)
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)

  function openHander(isOpen: boolean) {
    setOffsetTop(editor?.vditor.toolbar?.elements?.translation?.offsetTop || 0)
    setOffsetLeft(editor?.vditor.toolbar?.elements?.translation?.offsetLeft || 0)
    setOpen(isOpen)
    const preDom = document.querySelector('.vditor-reset') 
    const _range = document?.createRange()
    if (preDom && _range) {
      _range.selectNodeContents(preDom)
      setRange(_range)
    }
    if (isOpen) {
      setSelectedText(editor?.getSelection() || '')
    }
  }
  async function handleBlock(locale: string) {
    setOpen(false)
    if (selectedText) {
      setLoading(true)
      editor?.blur()
      const req = `将这段文字：${selectedText}，翻译为${locale}语言，直接返回翻译后的结果。`
      const res = await fetchAi(req)
      setLoading(false)
      if (range) {
        const selection = document.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
      editor?.focus()
      editor?.insertValue(res)
    } else {
      toast({
        title: '请先选择一段内容',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    emitter.on('toolbar-translation', () => {
      openHander(true)
    })
    return () => {
      emitter.off('toolbar-translation', () => {
        openHander(false)
      })
    }
  }, [])

  return (
    <DropdownMenu open={open} onOpenChange={openHander}>
      <DropdownMenuTrigger asChild className="outline-none" disabled={loading || !apiKey}>
        <div>
          <TooltipButton tooltipText="翻译" icon={<Languages />} disabled={loading || !apiKey} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 fixed" style={{ top: offsetTop + 32, left: offsetLeft }}>
        <DropdownMenuLabel>将选中的文本进行翻译</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            locales.map(item => (
              <DropdownMenuItem key={item} onClick={(e) => {
                e.preventDefault()
                handleBlock(item)
              }}>
                {item}
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}