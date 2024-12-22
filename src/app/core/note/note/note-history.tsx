import { TooltipButton } from "@/components/tooltip-button";
import { Check, Clock, Trash } from "lucide-react";
import { getNotesByTagId, Note } from '@/db/notes';
import useTagStore from "@/stores/tag";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useNoteStore from "@/stores/note";
import { useEffect } from "react";
import dayjs from "dayjs";
import { extractTitle } from '@/lib/markdown'
import { Button } from "@/components/ui/button";
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh'

dayjs.extend(relativeTime)
dayjs.locale(zh)

export function NoteHistory() {
  const { currentTagId } = useTagStore()
  const { currentNotes, fetchCurrentNotes, fetchNoteById, deleteNote } = useNoteStore()

  async function getNotes() {
    const nots = await getNotesByTagId(currentTagId)
    return nots
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
            <div className="flex items-center gap-4 text-sm py-1">
              <span className="w-8 text-center">{index+1}</span>
              <span className="flex-1 ellipsis line-clamp-1">{extractTitle(note.content || '')}</span>
              <span>{dayjs(note.createdAt).fromNow()}</span>
              <div>
                <Button variant="ghost" size="sm" className="w-8" onClick={() => selectHistory(note)}>
                  <Check />
                </Button>
                <Button variant="ghost" size="sm" className="w-8" onClick={() => handleDeleteNote(note)}>
                  <Trash className="text-red-900" />
                </Button>
              </div>
            </div>
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
    </div>
  )
}