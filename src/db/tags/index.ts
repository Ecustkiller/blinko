
import Database from '@tauri-apps/plugin-sql';

export interface Tag {
  id: number
  name: string
  isLocked?: boolean
  isPin?: boolean
  total?: number
}

export async function getTagsDb() {
  return await Database.load('sqlite:note.db');
}

// 创建 tags 表
export async function initTagsDb() {
  const db = await getTagsDb()
  await db.execute(`
    create table if not exists tags (
      id integer primary key autoincrement,
      name text not null,
      isLocked boolean DEFAULT false,
      isPin boolean DEFAULT false
    )
  `)
  const hasDefaultTag = (await db.select<Tag[]>(`select * from tags`)).length === 0
  if (hasDefaultTag) {
    db.execute(`insert into tags (name, isLocked, isPin) values (
      '灵感',
      true,
      true
    )`)
  }
}

export async function getTags() {
  const db = await getTagsDb();
  return await db.select<Tag[]>(`select * from tags`)
}

export async function insertTag(tag: Partial<Tag>) {
  const db = await getTagsDb();
  return await db.execute(`insert into tags (name) values (
      '${tag.name}'
    )
  `)
}

export async function updateTag(tag: Tag) {
  const db = await getTagsDb();
  return await db.execute(`
    update tags set 
    name = '${tag.name}',
    isLocked = ${tag.isLocked},
    isPin = ${tag.isPin}
    where id = ${tag.id}`
  )
}

export async function delTag(id: number) {
  const db = await getTagsDb();
  return await db.execute(`delete from tags where id = ${id}`)
}