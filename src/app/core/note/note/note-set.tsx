import { TooltipButton } from "@/components/tooltip-button";
import { Clock, Save, Trash } from "lucide-react";
import { getNotesByTagId, insertNote } from '@/db/notes';
import { Store } from "@tauri-apps/plugin-store";
import useTagStore from "@/stores/tag";

export function NoteSet({ content }: { content: string }) {
  const { currentTagId } = useTagStore()

  async function saveNote() {
    const locale = await(await Store.load('store.json')).get<string>('note_locale')
    const count = await(await Store.load('store.json')).get<string>('note_count')
    const note = {
      tagId: currentTagId,
      locale,
      count,
      content,
      createdAt: Date.now()
    }
    await insertNote(note)
  }

  async function getNotes() {
    const nots = await getNotesByTagId(currentTagId)
    console.log(nots);
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipButton icon={<Clock />} tooltipText="历史笔记" onClick={getNotes} />
      <TooltipButton icon={<Save />} tooltipText="保存笔记" onClick={saveNote} />
      <TooltipButton icon={<Trash />} tooltipText="删除笔记" />
    </div>
  )
}