import { getDb } from "./index"

export enum MarkType {
  scan = '截图',
  text = '文本',
  image = '插图',
}

export interface Note {
  id: number
  tagId: number
  content?: string
  locale: string
  count: string
  createdAt: number
}

// 创建 marks 表
export async function initNotesDb() {
  const db = await getDb()
  await db.execute(`
    create table if not exists notes (
      id integer primary key autoincrement,
      tagId integer not null,
      content text default null,
      locale text not null,
      count text not null,
      createdAt integer
    )
  `)
}