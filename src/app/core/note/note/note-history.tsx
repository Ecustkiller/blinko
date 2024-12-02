import { TooltipButton } from "@/components/tooltip-button";
import { Clock, Save, Trash } from "lucide-react";
import { getNotesByTagId, insertNote, Note } from '@/db/notes';
import { Store } from "@tauri-apps/plugin-store";
import useTagStore from "@/stores/tag";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useNoteStore from "@/stores/note";
import { useEffect } from "react";
import dayjs from "dayjs";
import { Separator } from "@/components/ui/separator";
import { extractTitle } from '@/lib/markdown'
import { Button } from "@/components/ui/button";

export function NoteHistory({ content }: { content: string }) {
  const { currentTagId } = useTagStore()
  const { currentNote, currentNotes, fetchCurrentNotes, fetchCurrentNote, fetchNoteById, deleteNote } = useNoteStore()

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
    await fetchCurrentNotes()
    await fetchCurrentNote()
  }

  async function getNotes() {
    const nots = await getNotesByTagId(currentTagId)
  }

  function selectHistory(note: Note) {
    fetchNoteById(note.id)
  }

  function handleDeleteNote(note: Note) {
    deleteNote(note.id)
    fetchCurrentNotes()
  }

  useEffect(() => {
    fetchCurrentNotes()
  }, [fetchCurrentNotes])

  function NotesTable() {
    return (
      <div className="max-h-80 overflow-y-auto">
        {currentNotes.map((note, index) => (
          <div key={note.id}>
            <div className="flex items-center gap-4 text-sm py-2 cursor-pointer hover:bg-zinc-50" onClick={() => selectHistory(note)}>
              <span className="w-8 text-center">{index+1}</span>
              <span className="flex-1 ellipsis line-clamp-1">{extractTitle(note.content || '')}</span>
              <span>{dayjs(note.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              <Button variant="ghost" size="sm" className="w-8" onClick={() => handleDeleteNote(note)}>
                <Trash className="text-red-900" />
              </Button>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <TooltipButton icon={<Clock />} tooltipText="历史笔记" onClick={getNotes} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[640px]" side="bottom" align="end">
          {
            currentNotes.length > 0 ? <NotesTable /> :
            <div className="flex items-center justify-center h-48 leading-10 text-zinc-500">暂无历史笔记</div>
          }
        </PopoverContent>
      </Popover>
      <TooltipButton icon={<Save />}
        disabled={currentNote && currentNotes.map(note => note.id).includes(currentNote.id)}
        tooltipText="保存笔记"
        onClick={saveNote}
      />
      {/* <TooltipButton icon={<Trash />} tooltipText="删除笔记" /> */}
    </div>
  )
}