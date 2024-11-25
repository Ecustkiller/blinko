import { TooltipButton } from "@/components/tooltip-button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store } from "@tauri-apps/plugin-store";
import { PencilRuler } from "lucide-react";
import React, { useEffect } from "react";

export function CountSet() {

  const [locale, setLocale] = React.useState('500')

  const locales = ['200', '500', '1000', '2000', '5000']

  async function getNoteCount() {
    const store = await Store.load('store.json');
    const res = await store.get<string>('note_count')
    if (res) {
      setLocale(res)
    }
  }

  async function localeChange(res: string) {
    setLocale(res)
    const store = await Store.load('store.json');
    await store.set('note_count', res)
  }

  useEffect(() => {
    getNoteCount()
  }, [])

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
          <RadioGroup defaultValue={locale} onValueChange={localeChange}>
            {
              locales.map((locale) => (
                <div className="flex items-center space-x-2" key={locale}>
                  <RadioGroupItem value={locale} id={locale} />
                  <Label htmlFor={locale}>{locale}字</Label>
                </div>
              ))
            }
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}