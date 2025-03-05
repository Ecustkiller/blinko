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
  type: 'built-in' | 'custom'
  temperature: number
  apiKey?: string
  model?: string
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
const baseAiConfig: AiConfig[] = [
  {
    key: 'chatgpt',
    title: 'ChatGPT',
    type: 'built-in',
    temperature: 0.7,
    baseURL: 'https://api.openai.com/v1',
    modelURL: 'https://api.openai.com/v1/models',
  },
  {
    key: 'gemini',
    title: 'Gemini',
    type: 'built-in',
    temperature: 0.7,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  },
  {
    key: 'ollama',
    title: 'Ollama',
    type: 'built-in',
    baseURL: 'http://localhost:11434',
    temperature: 0.7,
    modelURL: 'http://localhost:11434/v1/models',
  },
  {
    key: 'lmstudio',
    title: 'LM Studio',
    type: 'built-in',
    temperature: 0.7,
    baseURL: 'http://localhost:1234/v1',
    modelURL: 'http://localhost:1234/v1/models',
  },
  {
    key: 'deepseek',
    title: 'DeepSeek',
    type: 'built-in',
    temperature: 0.7,
    baseURL: 'https://api.deepseek.com',
    modelURL: 'https://api.deepseek.com/models',
  },
]

export { baseAiConfig }