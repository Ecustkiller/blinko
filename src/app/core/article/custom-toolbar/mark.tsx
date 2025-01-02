import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchAiStream } from "@/lib/ai";
import useArticleStore from "@/stores/article";
import { Plus, TicketPlus } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { MarkWrapper } from "../../record/mark/mark-item";
import { Clipboard } from "../../record/mark/clipboard";
import { MarkLoading } from "../../record/mark/mark-loading";
import useMarkStore from "@/stores/mark";
import { Button } from "@/components/ui/button";
import { Mark, delMark } from "@/db/marks";

export default function MarkInsert({mdRef}: {mdRef: RefObject<ExposeParam>}) {

  const { loading, setLoading } = useArticleStore()

  const { allMarks, queues, fetchAllMarks } = useMarkStore()

  async function handleBlock(mark: Mark) {
    setLoading(true)
    await delMark(mark.id)
    allMarks.splice(allMarks.findIndex(mark => mark.id === mark.id), 1)
    mdRef.current?.focus()
    switch (mark.type) {
      case 'text':
        mdRef.current?.insert(() => ({
          targetValue: mark.content || '',
        }))
        break;
      case 'image':
        mdRef.current?.insert(() => ({
          targetValue: `![${mark.desc}](${mark.url})`,
        }))
        break;
      default:
        const req = `这是一段 OCR 识别的结果：${mark.content}进行整理，直接返回整理后的结果。`
        let res = ''
        await fetchAiStream(req, text => {
          if (text === '[DONE]') return
          mdRef.current?.insert(() => ({
            targetValue: res += text,
          }))
        })
        break;
    }
    setLoading(false)
  }

  async function openChangeHandler (e: boolean) {
    if (e) {
      fetchAllMarks()
    }
  }

  return (
    <Popover onOpenChange={openChangeHandler}>
      <PopoverTrigger asChild>
        <Button disabled={loading} variant="ghost" size="icon" title="记录"><TicketPlus /></Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-0">
        <div className="px-2 py-2 flex items-end">
          <h4 className="leading-6 font-bold text-sm">使用记录</h4>
          <span className="text-xs text-zinc-500 font-normal ml-2 leading-5">消耗记录转化为内容插入到文章。</span>
        </div>
        <div className="max-h-[calc(100vh/1.5)] overflow-y-auto border-t">
          <Clipboard />
          {
            queues.map(mark => {
              return (
                <MarkLoading key={mark.queueId} mark={mark} />
              )
            })
          }
          {
            allMarks.length ?
            allMarks.map((mark) => (
              <div key={mark.id} className="flex items-center border-b last:border-none">
                <Button className="size-12 ml-2" onClick={() => handleBlock(mark)}variant="ghost"><Plus /></Button>
                <MarkWrapper mark={mark} />
              </div>
            )) :
            <div className="flex items-center justify-center text-zinc-500 text-xs text-center h-48">
              暂无记录
            </div>
          }
        </div>
      </PopoverContent>
    </Popover>
  )
}