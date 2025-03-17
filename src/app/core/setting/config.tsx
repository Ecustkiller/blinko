import { BotMessageSquare, LayoutTemplate, Command, FileUp, Palette, ScanText, Store, UserRoundCog } from "lucide-react"
// Define base configuration without translations
const baseConfig = [
  {
    icon: <BotMessageSquare />,
    anchor: 'ai',
  },
  {
    icon: <FileUp />,
    anchor: 'sync',
  },
  {
    icon: <ScanText />,
    anchor: 'ocr',
  },
  {
    icon: <LayoutTemplate />,
    anchor: 'template',
  },
  {
    icon: <Command />,
    anchor: 'shortcut',
  },
  {
    icon: <Palette />,
    anchor: 'theme',
  },
  {
    icon: <UserRoundCog />,
    anchor: 'dev',
  },
  {
    icon: <Store />,
    anchor: 'about',
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