import { Store } from '@tauri-apps/plugin-store'
import { create } from 'zustand'
import { getVersion } from '@tauri-apps/api/app'

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
        set({ [key]: res })
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

  aiType: 'openai',
  setAiType: (aiType) => set({ aiType }),

  baseURL: '',
  setBaseURL: (baseURL) => set({ baseURL }),

  apiKey: '',
  setApiKey: (apiKey) => set({ apiKey }),

  model: 'gpt-4o-mini',
  setModel: (model) => set({ model }),

  darkMode: 'system',
  setDarkMode: (darkMode) => set({ darkMode }),

  previewTheme: 'atom',
  setPreviewTheme: (previewTheme) => set({ previewTheme }),

  codeTheme: 'atom',
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