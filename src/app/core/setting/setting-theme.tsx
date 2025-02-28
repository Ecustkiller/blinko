import { SettingRow, SettingType } from "./setting-base";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { useTranslations } from 'next-intl';
import { useEffect } from "react";

export function PreviewThemeSelect() {
  const t = useTranslations();
  const { previewTheme, setPreviewTheme } = useSettingStore()

  const themes = ['github', 'vuepress', 'mk-cute', 'smart-blue', 'cyanosis']

  async function changeHandler(e: string) {
    setPreviewTheme(e)
    const store = await Store.load('store.json');
    store.set('previewTheme', e)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const theme = await store.get<string>('previewTheme')
      if (theme) {
        setPreviewTheme(theme)
      } else {
        setPreviewTheme(themes[0])
      }
    }
    init()
  }, [])

  return (
    <Select onValueChange={changeHandler} value={previewTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('settings.theme.selectTheme')} />
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

export function CodeThemeSelect() {
  const t = useTranslations();
  const { codeTheme, setCodeTheme } = useSettingStore()
  const themes = ['github', 'atom', 'a11y', 'gradient', 'kimbie', 'paraiso', 'qtcreator', 'stackoverflow']

  async function changeHandler(e: string) {
    setCodeTheme(e)
    const store = await Store.load('store.json');
    store.set('codeTheme', e)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const theme = await store.get<string>('codeTheme')
      if (theme) {
        setCodeTheme(theme)
      } else {
        setCodeTheme(themes[0])
      }
    }
    init()
  }, [])

  return (
    <Select onValueChange={changeHandler} value={codeTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('settings.theme.selectTheme')} />
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

export function SettingTheme({id, icon}: {id: string, icon?: React.ReactNode}) {
  const t = useTranslations();

  return (
    <SettingType id={id} icon={icon} title={t('settings.theme.title')}>
      <SettingRow border>
        <span>{t('settings.theme.previewTheme')}。</span>
        <PreviewThemeSelect />
      </SettingRow>
      <SettingRow border>
        <span>{t('settings.theme.codeTheme')}。</span>
        <CodeThemeSelect />
      </SettingRow>
    </SettingType>
  )
}