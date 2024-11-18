import { getMarks, Marks } from '@/db/marks'
import { Store } from '@tauri-apps/plugin-store';
import { create } from 'zustand'

interface MarkState {
  marks: Marks[]
  fetchMarks: () => Promise<void>
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
    set({ marks: res })
  }
}))

export default useMarkStore