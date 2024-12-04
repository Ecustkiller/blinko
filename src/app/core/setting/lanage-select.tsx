import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locales } from "@/lib/locales";
import { ControllerRenderProps } from "react-hook-form";

export function LanguageSelect({ field }: { field: ControllerRenderProps }) {
  return (
    <Select onValueChange={field.onChange} value={field.value} disabled={field.disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择语言" />
      </SelectTrigger>
      <SelectContent>
        {
          locales.map((locale) => (
            <SelectItem key={locale} value={locale}>{locale}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}