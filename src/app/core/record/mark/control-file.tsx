import { TooltipButton } from "@/components/tooltip-button"
import { FilePlus } from "lucide-react"
import { useTranslations } from 'next-intl'
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from "@tauri-apps/plugin-fs";
import useTagStore from "@/stores/tag";
import useMarkStore from "@/stores/mark";
import { insertMark } from "@/db/marks";

const textFileExtensions = ['txt', 'md', 'csv'];
const fileExtensions: string[] = []

export function ControlFile() {
  const t = useTranslations();
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
      await insertMark({ tagId: currentTagId, type: 'file', desc: resetText, content: resetText })
      await fetchMarks()
      await fetchTags()
      getCurrentTag()
    }
  }

  return (
    <TooltipButton icon={<FilePlus />} tooltipText={t('record.mark.type.file')} onClick={selectFile} />
  )
}