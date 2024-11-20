import { createWorker } from 'tesseract.js';
import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';

export default async function ocr(path: string) {
  const image = await readFile(`screenshot/${path}`, { baseDir: BaseDirectory.AppData });
  const blob = new Blob([image])
  const worker = await createWorker(['chi_sim', 'eng']);
  const ret = (await worker.recognize(blob)).data.text;
  await worker.terminate();
  return ret
}