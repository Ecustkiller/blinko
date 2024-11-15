import { getDb } from "../index"

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
  return await db.select<Marks[]>(`select * from marks where tagId = ${id}`)
}

export async function insertMark(mark: Partial<Marks>) {
  const db = await getDb();
  return await db.execute(`insert into marks (tagId, type, content, url, desc, createdAt) values (
      '${mark.tagId}',
      '${mark.type}',
      '${mark.content}',
      '${mark.url}',
      '${mark.desc}',
      ${Date.now()}
    )
  `)
}

export async function updateMark(mark: Marks) {
  const db = await getDb();
  return await db.execute(`
    update marks set 
    tagId = ${mark.tagId},
    content = '${mark.content}',
    url = '${mark.url}',
    desc = '${mark.desc}',
    createdAt = ${mark.createdAt}
    where id = ${mark.id}`
  )
}

export async function delMark(id: number) {
  const db = await getDb();
  return await db.execute(`delete from marks where id = ${id}`)
}