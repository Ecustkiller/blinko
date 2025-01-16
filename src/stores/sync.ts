import { GithubRepoInfo } from '@/lib/github.types'
import { create } from 'zustand'

export enum SyncStateEnum {
  checking = '检测中',
  success = '可用',
  creating = '创建中',
  fail = '不可用',
}

interface SyncState {
  imageRepoState: SyncStateEnum
  setImageRepoState: (imageRepoState: SyncStateEnum) => void
  imageRepoInfo?: GithubRepoInfo
  setImageRepoInfo: (imageRepoInfo?: GithubRepoInfo) => void

  syncRepoState: SyncStateEnum
  setSyncRepoState: (syncRepoState: SyncStateEnum) => void
  syncRepoInfo?: GithubRepoInfo
  setSyncRepoInfo: (syncRepoInfo?: GithubRepoInfo) => void
}

const useSyncStore = create<SyncState>((set) => ({
  imageRepoState: SyncStateEnum.fail,
  setImageRepoState: (imageRepoState) => {
    set({ imageRepoState })
  },
  imageRepoInfo: undefined,
  setImageRepoInfo: (imageRepoInfo) => {
    set({ imageRepoInfo })
  },

  syncRepoState: SyncStateEnum.fail,
  setSyncRepoState: (syncRepoState) => {
    set({ syncRepoState })
  },
  syncRepoInfo: undefined,
  setSyncRepoInfo: (syncRepoInfo) => {
    set({ syncRepoInfo })
  },
}))

export default useSyncStore