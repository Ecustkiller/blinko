import { getFiles, GithubFile } from '@/lib/github';
import { RepoNames } from '@/lib/github.types';
import { create } from 'zustand'

interface MarkState {
  images: GithubFile[]
  getImages: () => Promise<void>
}

const useImageStore = create<MarkState>((set) => ({
  images: [],
  async getImages() {
    const images = await getFiles({ path: '', repo: RepoNames.image })
    set({ images })
  },
}))

export default useImageStore