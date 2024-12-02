import { BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs"
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
  const isExist = await exists('article', { baseDir: BaseDirectory.AppData})
  if (!isExist) {
    await mkdir('article', { baseDir: BaseDirectory.AppData})
  }
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
  return (await db.select<Note[]>(`select * from notes where tagId = ${tagId} order by createdAt desc limit 1`))[0]
}

export async function getNoteById(id: number) {
  const db = await getDb()
  // 根据 id 获取 note
  return (await db.select<Note[]>(`select * from notes where id = ${id}`))[0]
}

export async function getNotesByTagId(tagId: number) {
  const db = await getDb()
  return await db.select<Note[]>(`select * from notes where tagId = ${tagId} order by createdAt desc`)
}

// 删除
export async function delNote(id: number) {
  const db = await getDb()
  return await db.execute(`delete from notes where id = ${id}`)
}
