import { SettingRow, SettingType } from "./setting-base";
import { Badge } from "@/components/ui/badge";

export function SettingShortcut({id, icon}: {id: string, icon?: React.ReactNode}) {

  return (
    <SettingType id={id} icon={icon} title="快捷键">
      <SettingRow>
        <span>
          截图是快速记录的最佳方式，可以通过全局快捷键快速截图，无需打开主页面。
        </span>
        <Badge>
          CommandOrControl + Shift + S
        </Badge>
      </SettingRow>
    </SettingType>
  )
}