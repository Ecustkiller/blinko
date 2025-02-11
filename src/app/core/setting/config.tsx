import { BotMessageSquare, LayoutTemplate, Command, FileUp, Palette, ScanText, Store, UserRoundCog } from "lucide-react"
import { SettingAbout } from "./setting-about"
import { SettingAI } from "./setting-ai"
import { SettingSync } from "./setting-sync"
import { SettingOCR } from "./setting-ocr"
import { SettingShortcut } from "./setting-shortcut"
import { SettingTheme } from "./setting-theme"
import { SettingDev } from "./setting-dev"
import { SettingTemplate } from "./setting-template"

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
    title: '整理模板',
    icon: <LayoutTemplate />,
    anchor: 'template',
    children: SettingTemplate,
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
  {
    title: '开发者',
    icon: <UserRoundCog />,
    anchor: 'dev',
    children: SettingDev,
  },
]

export default config

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

const aiConfig = [
  {
    key: 'custom',
    title: '自定义',
    baseURL: null,
  },
  {
    key: 'chatgpt',
    title: 'ChatGPT',
    baseURL: 'https://api.openai.com/v1',
    modelURL: 'https://api.openai.com/v1/models',
  },
  {
    key: 'chatanywhere',
    title: 'ChatAnyWhere',
    baseURL: 'https://api.chatanywhere.tech/v1',
    modelURL: 'https://api.chatanywhere.tech/v1/models',
  },
  {
    key: 'ollama',
    title: 'Ollama',
    baseURL: 'http://localhost:11434',
    modelURL: 'http://localhost:11434/v1/models',
  },
  {
    key: 'lmstudio',
    title: 'LM Studio',
    baseURL: 'http://localhost:1234/v1',
    modelURL: 'http://localhost:1234/v1/models',
  },
  {
    key: 'volcengine',
    title: '豆包',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  },
  {
    key: 'aliyun',
    title: '通义千问',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/models',
  },
  {
    key: 'moonshot',
    title: 'Kimi',
    baseURL: 'https://api.moonshot.cn/v1',
    modelURL: 'https://api.moonshot.cn/v1/models',
  },
  {
    key: 'deepseek',
    title: 'DeepSeek',
    baseURL: 'https://api.deepseek.com',
    modelURL: 'https://api.deepseek.com/models',
  },
]

export { aiConfig }