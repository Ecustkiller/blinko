'use client'
import { SettingTab } from "./setting-tab"
import config from "./config"

export default function Page() {
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