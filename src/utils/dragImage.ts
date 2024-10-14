import { listen } from "@tauri-apps/api/event"
import { readBinaryFile } from '@tauri-apps/api/fs';
import { uploadImage } from '../api/image'

listen('tauri://file-drop', async (event) => {
  console.log(event);
  const filePaths = event.payload as string[];
  for (const filePath of filePaths) {
    const binaryFile = await readBinaryFile(filePath);
    const blob = new Blob([binaryFile], { type: 'application/octet-stream' });
    uploadImage(blob)
  }
})