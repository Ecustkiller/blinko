import useSettingStore from "@/stores/setting";
export function Version() {
  const { version } = useSettingStore()

  return (
    <span className="text-sm text-muted-foreground">{version || '正在查询版本信息'}</span>
  )
}