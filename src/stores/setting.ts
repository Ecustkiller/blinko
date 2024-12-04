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
        console.log(`store ${key} is ${res}`);
      } else {
        await store.set(key, value)
        console.log(`data ${key} is ${value}`);
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
}))

export default useSettingStore