import { uploadImageByGithub } from "./github";
import { Store } from "@tauri-apps/plugin-store";

export async function uploadImage(file: File) {
  const store = await Store.load('store.json');
  const mainImageHosting = await store.get('mainImageHosting')
  switch (mainImageHosting) {
    case 'github':
      return uploadImageByGithub(file)
    default:
      return undefined
  }
}