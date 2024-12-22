import { getFiles, GithubFile } from '@/lib/github';
import { RepoNames } from '@/lib/github.types';
import { create } from 'zustand'

interface MarkState {
  images: GithubFile[]
  deleteImage: (name: string) => void
  getImages: () => Promise<void>
}

const useImageStore = create<MarkState>((set) => ({
  images: [],

  deleteImage: (name) => {
    set(state => ({
      images: state.images.filter(item => item.name !== name)
    }))
  },
  async getImages() {
    set({ images: [] })
    const images = await getFiles({ path: '', repo: RepoNames.image })
    set({ images })
  },
}))

export default useImageStore