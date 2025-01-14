'use client'
import { SettingAbout } from "./setting-about"
import { SettingTab } from "./setting-tab"
import { SettingAI } from "./setting-ai"
import { SettingSync } from "./setting-sync"
import { SettingOCR } from "./setting-ocr"
import { SettingShortcut } from "./setting-shortcut"

export default function Page() {
  return <div className="flex">
    <SettingTab />
    <div className="flex-1 p-4 overflow-y-auto h-screen">
      <SettingAbout />
      <SettingAI />
      <SettingSync />
      <SettingOCR />
      <SettingShortcut />
    </div>
  </div>
}