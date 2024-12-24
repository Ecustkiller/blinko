import { TooltipButton } from "@/components/tooltip-button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Languages } from "lucide-react";
import React, { useEffect } from "react";
import useNoteStore from "@/stores/note";
import { locales } from "@/lib/locales";

export function LocaleSet() {
  const { setLocale, locale, getLocale } = useNoteStore()

  async function localeChange(res: string) {
    setLocale(res)
  }

  useEffect(() => {
    getLocale()
  }, [getLocale])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <TooltipButton icon={<Languages />} tooltipText="语言" />
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