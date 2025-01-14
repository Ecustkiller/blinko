import { BotMessageSquare, Command, FileUp, Palette, ScanText, Store } from "lucide-react"
import { SettingAbout } from "./setting-about"
import { SettingAI } from "./setting-ai"
import { SettingSync } from "./setting-sync"
import { SettingOCR } from "./setting-ocr"
import { SettingShortcut } from "./setting-shortcut"
import { SettingTheme } from "./setting-theme"

const config = [
  {
    title: '关于',
    icon: <Store />,
    anchor: 'about',
    children: SettingAbout,
  },
  {
    title: 'AI',
    icon: <BotMessageSquare />,
    anchor: 'ai',
    children: SettingAI,
  },
  {
    title: '同步',
    icon: <FileUp />,
    anchor: 'sync',
    children: SettingSync,
  },
  {
    title: 'OCR',
    icon: <ScanText />,
    anchor: 'ocr',
    children: SettingOCR,
  },
  {
    title: '快捷键',
    icon: <Command />,
    anchor: 'shortcut',
    children: SettingShortcut,
  },
  {
    title: '外观',
    icon: <Palette />,
    anchor: 'theme',
    children: SettingTheme,
  },
]

export default config