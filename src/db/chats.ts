import { getDb } from "./index"

export type Role = 'system' | 'user'
export type ChatType = 'chat' | 'note' | 'clipboard'

export interface Chat {
  id: number
  tagId: number
  content?: string
  role: Role
  type: ChatType
  createdAt: number
}

// 创建 chats 表
export async function initChatsDb() {
  const db = await getDb()
  await db.execute(`
    create table if not exists notes (
      id integer primary key autoincrement,
      tagId integer not null,
      content text default null,
      role text not null,
      type text not null,
      createdAt integer not null
    )
  `)
}
