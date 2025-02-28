'use client'
import { SettingTab } from "./setting-tab"
import baseConfig from "./config"
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('settings')
  
  // Add translations to the config
  const config = baseConfig.map(item => ({
    ...item,
    title: t(`${item.anchor}.title`)
  }))
  
  return <div className="flex">
    <SettingTab />
    <div id="setting-form" className="flex-1 p-4 overflow-y-auto h-screen">
      {
        config.map((item) => {
          return <div key={item.anchor}>{item.children({id: item.anchor, icon: item.icon})}</div>
        })
      }
    </div>
  </div>
}