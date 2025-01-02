import { NoteSidebar } from "./note-sidebar"
import Chat from './chat'

export default function Page() {
  return (
    <div className="flex h-screen">
      <NoteSidebar />
      <Chat />
    </div>
  )
}
