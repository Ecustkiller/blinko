import { NoteSidebar } from "./note-sidebar"
import { Note } from './note'

export default function Page() {
  return (
    <div className="flex h-screen">
      <NoteSidebar />
      <Note />
    </div>
  )
}
