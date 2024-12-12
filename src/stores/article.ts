import { getFiles } from '@/lib/github'
import { GithubContent } from '@/lib/github.types'
import { BaseDirectory, DirEntry, readDir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { Store } from '@tauri-apps/plugin-store'
import { create } from 'zustand'

export interface Article {
  article: string
  path: string
}

interface NoteState {
  activeFilePath: string 
  setActiveFilePath: (name: string) => void

  fileTree: DirTree[]
  loadFileTree: () => Promise<void>
  newFolder: () => void
  newFile: () => void

  collapsibleList: string[]
  initCollapsibleList: () => Promise<void>
  setCollapsibleList: (name: string, value: boolean) => Promise<void>

  currentArticle: string
  readArticle: (path: string) => Promise<void>
  setCurrentArticle: (content: string) => Promise<void>

  allArticle: Article[]
  loadAllArticle: () => Promise<void>
}

export interface DirTree extends DirEntry {
  children?: DirTree[]
  parent?: DirTree
  sha?: string
  isEditing?: boolean
  isLocale: boolean
}

const useArticleStore = create<NoteState>((set, get) => ({
  activeFilePath: '',
  setActiveFilePath: async (path: string) => {
    set({ activeFilePath: path })
    const store = await Store.load('store.json');
    await store.set('activeFilePath', path)
  },

  fileTree: [],
  loadFileTree: async () => {
    set({ fileTree: [] })
    const cacheTree: DirTree[] = []
    const dirs = (await readDir('article', { baseDir: BaseDirectory.AppData })).sort((a, b) => a.name.localeCompare(b.name))
    cacheTree.push(...dirs.filter(file => file.name !== '.DS_Store')
      .map(file => ({ ...file, parent: undefined, isEditing: false, isLocale: true })))
    for (let index = 0; index < cacheTree.length; index++) {
      const dir = cacheTree[index];
      if (dir.isDirectory) {
        const files = await readDir(`article/${dir.name}`, { baseDir: BaseDirectory.AppData });
        dir.children = files.filter(file => file.name !== '.DS_Store').map(file => ({ ...file, parent: dir, isEditing: false, isLocale: true }))
      }
    }
    set({ fileTree: cacheTree })
    const githubFiles = await getFiles({ path: 'article' })
    if (githubFiles) {
      githubFiles.forEach((file: GithubContent) => {
        const index = cacheTree.findIndex(item => item.name === file.path.replace('article/', ''))
        if (index !== -1) {
          cacheTree[index].sha = file.sha
        } else {
          cacheTree.unshift({
            name: file.path.replace('article/', '').replace('_', ' '),
            isFile: file.type === 'file',
            isSymlink: false,
            parent: undefined,
            isEditing: false,
            isDirectory: file.type === 'dir',
            sha: file.sha,
            isLocale: false
          })
        }
      });
      set({ fileTree: cacheTree })
    }
  },
  newFolder: async () => {
    const newDir: DirTree = {
      name: '',
      isFile: false,
      isSymlink: false,
      parent: undefined,
      isEditing: true,
      isDirectory: true,
      isLocale: true,
      children: []
    }
    const fileTree = get().fileTree
    fileTree.unshift(newDir)
    set({ fileTree })
  },
  newFile: async () => {
    const newDir: DirTree = {
      name: '',
      isFile: true,
      isSymlink: false,
      parent: undefined,
      isEditing: true,
      isLocale: true,
      isDirectory: false,
    }
    const fileTree = get().fileTree
    fileTree.unshift(newDir)
    set({ fileTree })
  },

  collapsibleList: [],
  initCollapsibleList: async () => {
    const store = await Store.load('store.json');
    const res = await store.get<string[]>('collapsibleList')
    const activeFilePath = await store.get<string>('activeFilePath')
    if (activeFilePath) {
      set({ activeFilePath })
      get().readArticle(activeFilePath)
    }
    set({ collapsibleList: res || [] })
  },
  setCollapsibleList: async (name: string, value: boolean) => {
    const collapsibleList = get().collapsibleList
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
    if (!path) return
    const res = await readTextFile(`article/${path}`, { baseDir: BaseDirectory.AppData })
    set({ currentArticle: res })
  },
  setCurrentArticle: async (content: string) => {
    set({ currentArticle: content })
    if (content) {
      const path = get().activeFilePath
      await writeTextFile(`article/${path}`, content, { baseDir: BaseDirectory.AppData })
    }
  },
  
  allArticle: [],
  loadAllArticle: async () => {
    const res = await readDir('article', { baseDir: BaseDirectory.AppData })
    const allArticle = res.filter(file => file.isFile && file.name !== '.DS_Store').map(file => ({ article: '', path: file.name }))
    for (let index = 0; index < allArticle.length; index += 1) {
      const file = allArticle[index];
      const article = await readTextFile(`article/${file.path}`, { baseDir: BaseDirectory.AppData })
      allArticle[index].article = article
    }
    set({ allArticle })
  }
}))

export default useArticleStore