import { TooltipButton } from "@/components/tooltip-button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PencilRuler } from "lucide-react";
import React, { useEffect } from "react";
import useNoteStore, { counts } from "@/stores/note";

export function CountSet() {

  const { setCount, getCount, count } = useNoteStore()

  async function localeChange(res: string) {
    setCount(Number(res))
  }

  useEffect(() => {
    getCount()
  }, [getCount])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <TooltipButton icon={<PencilRuler />} tooltipText="字数" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56" side="bottom" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">选择字数</h4>
            <p className="text-sm text-muted-foreground">
              此设置仅可能不及预期，具体生成的字数与笔记内容有关。
            </p>
          </div>
          <RadioGroup defaultValue={count.toString()} onValueChange={localeChange}>
            {
              counts.map((count) => (
                <div className="flex items-center space-x-2" key={count}>
                  <RadioGroupItem value={count.toString()} id={count.toString()} />
                  <Label htmlFor={count.toString()}>{count}字</Label>
                </div>
              ))
            }
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}