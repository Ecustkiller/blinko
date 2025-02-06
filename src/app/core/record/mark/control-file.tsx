import { TooltipButton } from "@/components/tooltip-button"
import { FilePlus } from "lucide-react"
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, readFile } from "@tauri-apps/plugin-fs";
import useTagStore from "@/stores/tag";
import useMarkStore from "@/stores/mark";
import { insertMark } from "@/db/marks";
import { getDocument } from 'pdfjs-dist'
import "pdfjs-dist/build/pdf.worker.mjs";

const textFileExtensions = ['txt', 'md', 'csv'];
const fileExtensions = ['pdf']

export function ControlFile() {
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function selectFile() {
    const filePath = await open({
      multiple: false,
      directory: false,
      filters: [{
        name: 'files',
        extensions: [...textFileExtensions, ...fileExtensions]
      }]
    });
    if (!filePath) return
    await readFileByPath(filePath)
  }

  async function readFileByPath(path: string) {
    const ext = path.substring(path.lastIndexOf('.') + 1)
    if (textFileExtensions.includes(ext)) {
      const content = await readTextFile(path)
      const resetText = content.replace(/'/g, '')
      await insertMark({ tagId: currentTagId, type: 'text', desc: resetText, content: resetText })
      await fetchMarks()
      await fetchTags()
      getCurrentTag()
    }
    if (ext === 'pdf') {
      const file = await readFile(path)
      getDocument(file).promise.then(pdf => {
        const numPages = pdf.numPages;
        for (let i = 1; i <= numPages; i++) {
          pdf.getPage(i).then(page => {
            page.getTextContent().then(content => {
              const text = content.items.map(item => {
                if ('str' in item) {
                  return item.str
                }
                return ''
              }).join('');
              if (!text) return
              insertMark({ tagId: currentTagId, type: 'text', desc: text, content: text })
              fetchMarks()
              fetchTags()
              getCurrentTag()
            });
          });
        }
      })
    }
  }

  return (
    <TooltipButton icon={<FilePlus />} tooltipText="文件" onClick={selectFile} />
  )
}