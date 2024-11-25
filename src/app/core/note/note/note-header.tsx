"use client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Clock, Globe, HardDriveDownload, PencilRuler, Save, Trash } from "lucide-react"
import * as React from "react"
import { initMarksDb } from "@/db/marks"
import { TooltipButton } from "@/components/tooltip-button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Store } from "@tauri-apps/plugin-store"
import { useEffect } from "react"

function LocalePopover() {

  const [locale, setLocale] = React.useState('简体中文')

  const locales = [
    '简体中文',
    'English',
    '日本語',
    'Українська', 
    'Français', 
    '한국어', 
    'Português', 
    'বাংলা', 
    'Italiano', 
    'فارسی', 
    'Русский', 
    'Čeština',
  ]

  async function getLocale() {
    const store = await Store.load('store.json');
    const res = await store.get<string>('note_locale')
    if (res) {
      setLocale(res)
    }
  }

  async function localeChange(res: string) {
    setLocale(res)
    const store = await Store.load('store.json');
    await store.set('note_locale', res)
  }

  useEffect(() => {
    getLocale()
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <TooltipButton icon={<Globe />} tooltipText="语言" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56" side="bottom" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">选择语言</h4>
            <p className="text-sm text-muted-foreground">
              此设置只对当前笔记生效。
            </p>
          </div>
          <RadioGroup defaultValue={locale} onValueChange={localeChange}>
            {
              locales.map((locale) => (
                <div className="flex items-center space-x-2" key={locale}>
                  <RadioGroupItem value={locale} id={locale} />
                  <Label htmlFor={locale}>{locale}</Label>
                </div>
              ))
            }
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function NoteHeader({total = 0}) {
  React.useEffect(() => {
    initMarksDb()
  }, [])

  return (
    <header className="h-12 flex items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <LocalePopover />
          <TooltipButton icon={<PencilRuler />} tooltipText="字数" />
        </TooltipProvider>
      </div>
      <div className="flex items-center h-6 gap-1">
        <TooltipProvider>
          <span className="text-sm px-2">{total} 字</span>
          <Separator orientation="vertical" />
          <span className="text-sm px-2">2024-11-21 04:10:15</span>
          <Separator orientation="vertical" />
          <TooltipButton icon={<Clock />} tooltipText="历史记录" />
          <TooltipButton icon={<Save />} tooltipText="保存记录" />
          <TooltipButton icon={<Trash />} tooltipText="删除记录" />
          <Separator orientation="vertical" />
          <TooltipButton icon={<HardDriveDownload />} tooltipText="生成文章" />
        </TooltipProvider>
      </div>
    </header>
  )
}
