import { create } from 'zustand'
import { Chat, getChats, insertChat, updateChat } from '@/db/chats'
import { Store } from '@tauri-apps/plugin-store';
import { locales } from '@/lib/locales';

interface ChatState {
  loading: boolean
  setLoading: (loading: boolean) => void

  chats: Chat[]
  init: (tagId: number) => Promise<void> // 初始化 chats
  insert: (chat: Omit<Chat, 'id' | 'createdAt'>) => Promise<Chat | null> // 插入一条 chat
  updateChat: (chat: Chat) => void // 更新一条 chat
  saveChat: (chat: Chat) => Promise<void> // 保存一条 chat，用于动态 AI 回复结束后保存数据库

  locale: string
  getLocale: () => Promise<void>
  setLocale: (locale: string) => void
}

const useChatStore = create<ChatState>((set, get) => ({
  loading: false,
  setLoading: (loading: boolean) => {
    set({ loading })
  },

  chats: [],
  init: async (tagId: number) => {
    const data = await getChats(tagId)
    set({ chats: data })
  },
  insert: async (chat: Omit<Chat, 'id' | 'createdAt'>) => {
    const res = await insertChat(chat)
    let data: Chat
    if (res.lastInsertId) {
      data =  {
        id: res.lastInsertId,
        createdAt: Date.now(),
        ...chat
      }
      const chats = get().chats
      const newChats = [...chats, data]
      set({ chats: newChats })
      return data
    }
    return null
  },
  updateChat: (chat: Chat) => {
    const chats = get().chats
    const newChats = chats.map(item => {
      if (item.id === chat.id) {
        return chat
      }
      return item
    })
    set({ chats: newChats })
  },
  saveChat: async (chat: Chat) => {
    updateChat(chat)
  },

  locale: locales[0],
  getLocale: async () => {
    const store = await Store.load('store.json');
    const res = (await store.get<string>('note_locale')) || locales[0]
    set({ locale: res })
  },
  setLocale: async (locale: string) => {
    set({ locale })
    const store = await Store.load('store.json');
    await store.set('note_locale', locale)
  },
}))

export default useChatStore