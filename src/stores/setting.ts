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

  apiKey: string
  setApiKey: (apiKey: string) => void

  model: string
  setModel: (language: string) => void

  markDescGen: boolean
  setMarkDescGen: (markDescGen: boolean) => void

  darkMode: string
  setDarkMode: (darkMode: string) => void

  previewTheme: string
  setPreviewTheme: (previewTheme: string) => void

  codeTheme: string
  setCodeTheme: (codeTheme: string) => void

  tesseractList: string
  setTesseractList: (tesseractList: string) => void

  screenshotShortcut: string
  setScreenshotShortcut: (screenshotShortcut: string) => void

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
  setAutoUpdate: (autoUpdate: boolean) => set({ autoUpdate }),

  language: '简体中文',
  setLanguage: (language: string) => set({ language }),

  apiKey: '',
  setApiKey: (apiKey: string) => set({ apiKey }),

  model: 'gpt-4o-mini',
  setModel: (model: string) => set({ model }),

  markDescGen: true,
  setMarkDescGen: (markDescGen: boolean) => set({ markDescGen }),

  darkMode: 'system',
  setDarkMode: (darkMode: string) => set({ darkMode }),

  previewTheme: 'atom',
  setPreviewTheme: (previewTheme: string) => set({ previewTheme }),

  codeTheme: 'atom',
  setCodeTheme: (codeTheme: string) => set({ codeTheme }),

  tesseractList: 'eng,chi_sim',
  setTesseractList: (tesseractList: string) => set({ tesseractList }),

  screenshotShortcut: 'Command+Shift+R',
  setScreenshotShortcut: (screenshotShortcut: string) => set({ screenshotShortcut }),

  githubUsername: '',
  setGithubUsername: async(githubUsername: string) => {
    set({ githubUsername })
    const store = await Store.load('store.json');
    store.set('githubUsername', githubUsername)
  },

  accessToken: '',
  setAccessToken: (accessToken: string) => set({ accessToken }),

  jsdelivr: true,
  setJsdelivr: (jsdelivr: boolean) => set({ jsdelivr }),
}))

export default useSettingStore