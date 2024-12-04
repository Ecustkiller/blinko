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

  markDescGen: boolean
  setMarkDescGen: (markDescGen: boolean) => void

  darkMode: string
  setDarkMode: (darkMode: string) => void

  previewTheme: string
  setPreviewTheme: (previewTheme: string) => void

  codeTheme: string
  setCodeTheme: (codeTheme: string) => void

  tesseractList: string[]
  setTesseractList: (tesseractList: string[]) => void

  screenshotShortcut: string
  setScreenshotShortcut: (screenshotShortcut: string) => void

  sync: boolean
  setSync: (sync: boolean) => void

  githubUsername: string
  setGithubUsername: (githubUsername: string) => void

  accessToken: string
  setAccessToken: (accessToken: string) => void

  repositoryName: string
  setRepositoryName: (repositoryName: string) => void
}


const useSettingStore = create<SettingState>((set, get) => ({
  initSettingData: async () => {
    const store = await Store.load('store.json');
    await get().setVersion()
    Object.entries(get()).forEach(async([key, value]) => {
      const res = await store.get(key)
      if (typeof value === 'function') return
      if (res) {
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

  markDescGen: true,
  setMarkDescGen: (markDescGen: boolean) => set({ markDescGen }),

  darkMode: 'system',
  setDarkMode: (darkMode: string) => set({ darkMode }),

  previewTheme: 'atom',
  setPreviewTheme: (previewTheme: string) => set({ previewTheme }),

  codeTheme: 'atom',
  setCodeTheme: (codeTheme: string) => set({ codeTheme }),

  tesseractList: [],
  setTesseractList: (tesseractList: string[]) => set({ tesseractList }),

  screenshotShortcut: 'Command+Shift+R',
  setScreenshotShortcut: (screenshotShortcut: string) => set({ screenshotShortcut }),

  sync: false,
  setSync: (sync: boolean) => set({ sync }),

  githubUsername: '',
  setGithubUsername: (githubUsername: string) => set({ githubUsername }),

  accessToken: '',
  setAccessToken: (accessToken: string) => set({ accessToken }),

  repositoryName: '',
  setRepositoryName: (repositoryName: string) => set({ repositoryName })
}))

export default useSettingStore