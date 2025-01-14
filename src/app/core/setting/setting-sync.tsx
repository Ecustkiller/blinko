import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";

export function SettingSync({id, icon}: {id: string, icon?: React.ReactNode}) {
  const { accessToken, setAccessToken } = useSettingStore()

  async function tokenChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setAccessToken(e.target.value)
    const store = await Store.load('store.json');
    await store.set('accessToken', e.target.value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const token = await store.get<string>('accessToken')
      if (token) {
        setAccessToken(token)
      } else {
        setAccessToken('')
      }
    }
    init()
  }, [])

  return (
    <SettingType id={id} icon={icon} title="同步">
      <SettingRow>
        <FormItem title="Github Access Token">
          <Input value={accessToken} onChange={tokenChangeHandler} />
        </FormItem>
      </SettingRow>
    </SettingType>
  )
}