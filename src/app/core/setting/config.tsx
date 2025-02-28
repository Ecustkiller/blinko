import { BotMessageSquare, LayoutTemplate, Command, FileUp, Palette, ScanText, Store, UserRoundCog } from "lucide-react"
import { SettingAbout } from "./setting-about"
import { SettingAI } from "./setting-ai"
import { SettingSync } from "./setting-sync"
import { SettingOCR } from "./setting-ocr"
import { SettingShortcut } from "./setting-shortcut"
import { SettingTheme } from "./setting-theme"
import { SettingDev } from "./setting-dev"
import { SettingTemplate } from "./setting-template"

// Define base configuration without translations
const baseConfig = [
  {
    icon: <Store />,
    anchor: 'about',
    children: SettingAbout,
  },
  {
    icon: <BotMessageSquare />,
    anchor: 'ai',
    children: SettingAI,
  },
  {
    icon: <FileUp />,
    anchor: 'sync',
    children: SettingSync,
  },
  {
    icon: <ScanText />,
    anchor: 'ocr',
    children: SettingOCR,
  },
  {
    icon: <LayoutTemplate />,
    anchor: 'template',
    children: SettingTemplate,
  },
  {
    icon: <Command />,
    anchor: 'shortcut',
    children: SettingShortcut,
  },
  {
    icon: <Palette />,
    anchor: 'theme',
    children: SettingTheme,
  },
  {
    icon: <UserRoundCog />,
    anchor: 'dev',
    children: SettingDev,
  },
]

export default baseConfig

export interface AiConfig {
  key: string
  title: string
  baseURL?: string
  modelURL?: string
}

export interface Model {
  id: string
  object: string
  created: number
  owned_by: string
}

// Define base AI configuration without translations
const baseAiConfig = [
  {
    key: 'custom',
    baseURL: null,
  },
  {
    key: 'chatgpt',
    baseURL: 'https://api.openai.com/v1',
    modelURL: 'https://api.openai.com/v1/models',
  },
  {
    key: 'chatanywhere',
    baseURL: 'https://api.chatanywhere.tech/v1',
    modelURL: 'https://api.chatanywhere.tech/v1/models',
  },
  {
    key: 'ollama',
    baseURL: 'http://localhost:11434',
    modelURL: 'http://localhost:11434/v1/models',
  },
  {
    key: 'lmstudio',
    baseURL: 'http://localhost:1234/v1',
    modelURL: 'http://localhost:1234/v1/models',
  },
  {
    key: 'volcengine',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  },
  {
    key: 'aliyun',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/models',
  },
  {
    key: 'moonshot',
    baseURL: 'https://api.moonshot.cn/v1',
    modelURL: 'https://api.moonshot.cn/v1/models',
  },
  {
    key: 'deepseek',
    baseURL: 'https://api.deepseek.com',
    modelURL: 'https://api.deepseek.com/models',
  },
]

export { baseAiConfig }