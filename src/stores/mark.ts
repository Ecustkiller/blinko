import { getAllMarks, getMarks, Mark } from '@/db/marks'
import { Store } from '@tauri-apps/plugin-store';
import { create } from 'zustand'

interface MarkState {
  marks: Mark[]
  fetchMarks: () => Promise<void>

  allMarks: Mark[]
  fetchAllMarks: () => Promise<void>
}

const useMarkStore = create<MarkState>((set) => ({
  marks: [],
  fetchMarks: async () => {
    const store = await Store.load('store.json');
    const currentTagId = await store.get<number>('currentTagId')
    if (!currentTagId) {
      return
    }
    const res = await getMarks(currentTagId)
    const decodeRes = res.map(item => {
      return {
        ...item,
        content: decodeURIComponent(item.content || '')
      }
    })
    set({ marks: decodeRes })
  },

  allMarks: [],
  fetchAllMarks: async () => {
    const res = await getAllMarks()
    const decodeRes = res.map(item => {
      return {
        ...item,
        content: decodeURIComponent(item.content || '')
      }
    })
    set({ allMarks: decodeRes })
  },
}))

export default useMarkStore