import { getDb } from "./index"

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
      createdAt integer not null
    )
  `)
}

export async function insertNote(note: Partial<Note>) {
  const db = await getDb()
  return await db.execute(`insert into notes (tagId, content, locale, count, createdAt) values (
      '${note.tagId}',
      ${note.content ? `"${encodeURIComponent(note?.content)}"`: null},
      '${note.locale}',
      '${note.count}',
      ${Date.now()}
    )
  `)
}

export async function getNoteByTagId(tagId: number) {
  const db = await getDb()
  return await db.select<Note>(`select * from notes where tagId = ${tagId} order by createdAt desc limit 1`)
}

export async function getNotesByTagId(tagId: number) {
  const db = await getDb()
  return await db.select<Note[]>(`select * from notes where tagId = ${tagId} order by createdAt desc`)
}