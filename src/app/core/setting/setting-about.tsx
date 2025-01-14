import useSettingStore from "@/stores/setting";
import { OpenBroswer } from "@/components/open-broswer";
import { SettingRow, SettingType } from "./setting-base";
import { Button } from "@/components/ui/button";
export function SettingAbout({id, icon}: {id: string, icon?: React.ReactNode}) {
  const { version } = useSettingStore()

  return (
    <SettingType id={id} icon={icon} title="关于">
      <SettingRow>
        <span>
          NoteGen v{version}，<OpenBroswer title="查询历史版本" url="https://github.com/codexu/note-gen/releases" />。
        </span>
        <Button disabled>检查更新</Button>
      </SettingRow>
    </SettingType>
  )
}