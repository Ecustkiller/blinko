import { getNoteByTagId, Note } from '@/db/notes';
import { Store } from '@tauri-apps/plugin-store';
import { create } from 'zustand'

export const locales = [
  '简体中文',
  'English',
  '日本語',
  'Українська', 
  'Français', 
  '한국어', 
  'Português', 
  'বাংলা', 
  'Italiano', 
  'فارسی', 
  'Русский', 
  'Čeština',
]

export const counts = [200, 500, 1000, 2000, 5000]

interface NoteState {
  currentNote?: Note
  fetchCurrentNote: () => Promise<void>

  locale: string
  getLocale: () => Promise<void>
  setLocale: (locale: string) => void

  count: number,
  getCount: () => Promise<void>
  setCount: (count: number) => void
}

const useNoteStore = create<NoteState>((set) => ({
  currentNote: undefined,
  fetchCurrentNote: async () => {
    const store = await Store.load('store.json');
    const currentTagId = await store.get<number>('currentTagId')
    if (!currentTagId) {
      return
    }
    const res = await getNoteByTagId(currentTagId)
    set({ currentNote: res })
  },

  locale: '简体中文',
  getLocale: async () => {
    const store = await Store.load('store.json');
    const res = (await store.get<string>('note_locale')) || '简体中文'
    set({ locale: res })
  },
  setLocale: async (locale: string) => {
    set({ locale })
    const store = await Store.load('store.json');
    await store.set('note_locale', locale)
  },

  count: 500,
  getCount: async () => {
    const store = await Store.load('store.json');
    const res = Number(await store.get<string>('note_count')) || 500
    set({ count: res })
  },
  setCount: async (count: number) => {
    set({ count })
    const store = await Store.load('store.json');
    await store.set('note_count', count)
  },
}))

export default useNoteStore