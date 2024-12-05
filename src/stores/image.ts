import { getFiles, GithubFile } from '@/lib/github';
import { create } from 'zustand'

interface MarkState {
  images: GithubFile[]
  getImages: () => Promise<void>
}

const useImageStore = create<MarkState>((set) => ({
  images: [],
  async getImages() {
    const images = await getFiles({ path: 'images' })
    set({ images })
  },
}))

export default useImageStore