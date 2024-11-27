import { BaseDirectory, DirEntry, readDir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { Store } from '@tauri-apps/plugin-store'
import { create } from 'zustand'

interface NoteState {
  activeFilePath: string 
  setActiveFilePath: (name: string) => void

  fileTree: DirTree[]
  loadFileTree: () => Promise<void>

  collapsibleList: string[]
  initCollapsibleList: () => Promise<void>
  setCollapsibleList: (name: string, value: boolean) => Promise<void>

  currentArticle: string
  readArticle: (path: string) => Promise<void>
  setCurrentArticle: (content: string) => Promise<void>
}

export interface DirTree extends DirEntry {
  children?: DirTree[]
  parent?: DirTree
}

const useArticleStore = create<NoteState>((set) => ({
  activeFilePath: '',
  setActiveFilePath: (path: string) => {
    set({ activeFilePath: path })
  },

  fileTree: [],
  loadFileTree: async () => {
    const cacheTree: DirTree[] = []
    const dirs = await readDir('article', { baseDir: BaseDirectory.AppData });
    cacheTree.push(...dirs.filter(file => file.name !== '.DS_Store'))
    for (let index = 0; index < cacheTree.length; index++) {
      const dir = cacheTree[index];
      if (dir.isDirectory) {
        const files = await readDir(`article/${dir.name}`, { baseDir: BaseDirectory.AppData });
        dir.children = files.filter(file => file.name !== '.DS_Store').map(file => ({ ...file, parent: dir }))
      }
    }
    set({ fileTree: cacheTree })
  },

  collapsibleList: [],
  initCollapsibleList: async () => {
    const store = await Store.load('store.json');
    const res = await store.get<string[]>('collapsibleList')
    set({ collapsibleList: res || [] })
  },
  setCollapsibleList: async (name: string, value: boolean) => {
    const collapsibleList = useArticleStore.getState().collapsibleList
    if (value) {
      collapsibleList.push(name)
    } else {
      collapsibleList.splice(collapsibleList.indexOf(name), 1)
    }
    const store = await Store.load('store.json');
    await store.set('collapsibleList', collapsibleList)
    set({ collapsibleList })
  },

  currentArticle: '',
  readArticle: async (path: string) => {
    console.log(path);
    const res = await readTextFile(`article/${path}`, { baseDir: BaseDirectory.AppData })
    console.log(res);
    set({ currentArticle: res })
  },
  setCurrentArticle: async (content: string) => {
    set({ currentArticle: content })
    const path = useArticleStore.getState().activeFilePath
    await writeTextFile(`article/${path}`, content, { baseDir: BaseDirectory.AppData })
  }
}))

export default useArticleStore