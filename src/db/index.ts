
import Database from '@tauri-apps/plugin-sql';

export async function getDb() {
  return await Database.load('sqlite:note.db');
}
