import { Store } from '@tauri-apps/plugin-store'
import { create } from 'zustand'
import { getVersion } from '@tauri-apps/api/app'

export interface GenTemplate {
  id: number
  title: string
  status: boolean
  content: string
  range: string
}

interface SettingState {
  initSettingData: () => Promise<void>

  version: string
  setVersion:  () => Promise<void>

  autoUpdate: boolean
  setAutoUpdate: (autoUpdate: boolean) => void

  language: string
  setLanguage: (language: string) => void

  aiType: string
  setAiType: (aiType: string) => void

  baseURL: string
  setBaseURL: (baseURL: string) => void

  apiKey: string
  setApiKey: (apiKey: string) => void

  model: string
  setModel: (language: string) => void

  templateList: GenTemplate[]
  setTemplateList: (templateList: GenTemplate[]) => Promise<void>

  darkMode: string
  setDarkMode: (darkMode: string) => void

  previewTheme: string
  setPreviewTheme: (previewTheme: string) => void

  codeTheme: string
  setCodeTheme: (codeTheme: string) => void

  tesseractList: string
  setTesseractList: (tesseractList: string) => void

  githubUsername: string
  setGithubUsername: (githubUsername: string) => Promise<void>

  accessToken: string
  setAccessToken: (accessToken: string) => void

  jsdelivr: boolean
  setJsdelivr: (jsdelivr: boolean) => void
}


const useSettingStore = create<SettingState>((set, get) => ({
  initSettingData: async () => {
    const store = await Store.load('store.json');
    await get().setVersion()
    Object.entries(get()).forEach(async([key, value]) => {
      const res = await store.get(key)
      if (typeof value === 'function') return
      if (res !== undefined && key!== 'version') {
        if (key === 'templateList') {
          set({ [key]: [] })
          setTimeout(() => {
            set({ [key]: res as GenTemplate[] })
          }, 0);
        } else {
          set({ [key]: res })
        }
      } else {
        await store.set(key, value)
      }
    })
  },

  version: '',
  setVersion: async() => {
    const version = await getVersion()
    set({ version })
  },

  autoUpdate: true,
  setAutoUpdate: (autoUpdate) => set({ autoUpdate }),

  language: '简体中文',
  setLanguage: (language) => set({ language }),

  aiType: 'custom',
  setAiType: (aiType) => set({ aiType }),

  baseURL: '',
  setBaseURL: (baseURL) => set({ baseURL }),

  apiKey: '',
  setApiKey: (apiKey) => set({ apiKey }),

  model: '',
  setModel: (model) => set({ model }),

  templateList: [
    {
      id: 0,
      title: '笔记',
      content: '整理成一篇详细完整的笔记',
      status: true,
      range: 'All'
    },
    {
      id: 1,
      title: '周报',
      content: '将最近一周的记录整理成一篇周报',
      status: true,
      range: 'Week'
    }
  ],
  setTemplateList: async (templateList) => {
    set({ templateList })
    const store = await Store.load('store.json')
    await store.set('templateList', templateList)
  },

  darkMode: 'system',
  setDarkMode: (darkMode) => set({ darkMode }),

  previewTheme: 'github',
  setPreviewTheme: (previewTheme) => set({ previewTheme }),

  codeTheme: 'github',
  setCodeTheme: (codeTheme) => set({ codeTheme }),

  tesseractList: 'eng,chi_sim',
  setTesseractList: (tesseractList) => set({ tesseractList }),

  githubUsername: '',
  setGithubUsername: async(githubUsername) => {
    set({ githubUsername })
    const store = await Store.load('store.json');
    store.set('githubUsername', githubUsername)
  },

  accessToken: '',
  setAccessToken: async (accessToken) => {
    await get().setGithubUsername('')
    set({ accessToken })
  },

  jsdelivr: true,
  setJsdelivr: (jsdelivr: boolean) => set({ jsdelivr }),
}))

export default useSettingStore