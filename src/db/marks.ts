import { getDb } from "./index"
import { BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs"

export enum MarkType {
  scan = '截图',
  text = '文本',
  image = '插图',
}

export interface Marks {
  id: number
  tagId: number
  type: 'scan' | 'text' | 'image'
  content?: string
  desc?: string
  url: string
  createdAt: number
}


// 创建 marks 表
export async function initMarksDb() {
  const isExist = await exists('screenshot', { baseDir: BaseDirectory.AppData})
  if (!isExist) {
    await mkdir('screenshot', { baseDir: BaseDirectory.AppData})
  }
  const db = await getDb()
  await db.execute(`
    create table if not exists marks (
      id integer primary key autoincrement,
      tagId integer not null,
      type text not null,
      content text default null,
      url text default null,
      desc text default null,
      createdAt integer
    )
  `)
  }

export async function getMarks(id: number) {
  const db = await getDb();
  // 根据 tagId 获取 marks，根据 createdAt 倒序
  return await db.select<Marks[]>(`select * from marks where tagId = ${id} order by createdAt desc`)
}

export async function insertMark(mark: Partial<Marks>) {
  const db = await getDb();
  return await db.execute(`insert into marks (tagId, type, content, url, desc, createdAt) values (
      '${mark.tagId}',
      ${mark.type ? `'${mark.type}'`: null},
      ${mark.content ? `"${encodeURIComponent(mark?.content)}"`: null},
      ${mark.url ? `'${mark.url}'`: null},
      ${mark.desc ? `'${mark.desc}'`: null},
      ${Date.now()}
    )
  `)
}

export async function updateMark(mark: Marks) {
  const db = await getDb();
  return await db.execute(`
    update marks set 
    tagId = ${mark.tagId},
    url = "${mark.url}",
    desc = "${mark.desc}",
    createdAt = ${mark.createdAt}
    where id = ${mark.id}`
  )
}

export async function delMark(id: number) {
  const db = await getDb();
  return await db.execute(`delete from marks where id = ${id}`)
}