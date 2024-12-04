import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";
const themes = ['github', 'vuepress', 'mk-cute', 'smart-blue', 'cyanosis']

export function PreviewThemeSelect({ field }: { field: ControllerRenderProps }) {
  return (
    <Select onValueChange={field.onChange} value={field.value} disabled={field.disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择主题" />
      </SelectTrigger>
      <SelectContent>
        {
          themes.map((theme) => (
            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}