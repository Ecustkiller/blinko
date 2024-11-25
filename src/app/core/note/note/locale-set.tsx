import { TooltipButton } from "@/components/tooltip-button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store } from "@tauri-apps/plugin-store";
import { Globe } from "lucide-react";
import React, { useEffect } from "react";

export function LocaleSet() {

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