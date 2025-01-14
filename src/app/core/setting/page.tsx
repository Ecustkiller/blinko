'use client'
import { SettingAbout } from "./setting-about"
import { SettingTab } from "./setting-tab"
import { SettingAI } from "./setting-ai"
import { SettingSync } from "./setting-sync"

export default function Page() {
  return <div className="flex">
    <SettingTab />
    <div className="flex-1 p-4">
      <SettingAbout />
      <SettingAI />
      <SettingSync />
    </div>
  </div>
}