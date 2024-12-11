import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchAiStream } from "@/lib/ai";
import { Globe } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { locales } from "@/lib/locales";
import { Button } from "@/components/ui/button";

export default function Translation({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  async function handleBlock(locale: string) {
    mdRef.current?.focus()
    const selectedText = mdRef.current?.getSelectedText()
    const req = `将这段文字：${selectedText}，翻译为${locale}语言，直接返回翻译后的结果。`
    let res = ''
    await fetchAiStream(req, text => {
      if (text === '[DONE]') return
      mdRef.current?.insert(() => ({
        targetValue: res += text,
      }))
      mdRef.current?.rerender();
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="outline-none">
        <Button variant="ghost" size="icon" title="翻译"><Globe /></Button>
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