import { getDb } from "./index"
import { Store } from '@tauri-apps/plugin-store';

export interface Tag {
  id: number
  name: string
  isLocked?: boolean
  isPin?: boolean
  total?: number
}

// 创建 tags 表
export async function initTagsDb() {
  const db = await getDb()
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
    await db.execute(`insert into tags (name, isLocked, isPin) values (
      '灵感',
      true,
      true
    )`)
    const tag = (await db.select<Tag[]>(`select * from tags where name = '灵感'`))[0]
    const store = await Store.load('store.json');
    await store.set('currentTagId', tag.id)
    await store.save()
  }
}

export async function getTags() {
  const db = await getDb();
  const tags = await db.select<Tag[]>(`select * from tags`)

  // 获取 tags 对应的 marks 数量
  for (const tag of tags) {
    // deleted = 0  
    const res = await db.select<{ total: number }[]>(`select count(*) as total from marks where tagId = ${tag.id} and deleted = 0`)
    tag.total = res[0].total
  }

  return tags
}

export async function insertTag(tag: Partial<Tag>) {
  const db = await getDb();
  return await db.execute(`insert into tags (name) values (
      '${tag.name}'
    )
  `)
}

export async function updateTag(tag: Tag) {
  const db = await getDb();
  return await db.execute(`
    update tags set 
    name = '${tag.name}',
    isLocked = ${tag.isLocked},
    isPin = ${tag.isPin}
    where id = ${tag.id}`
  )
}

export async function delTag(id: number) {
  const db = await getDb();
  return await db.execute(`delete from tags where id = ${id}`)
}