import { FileSidebar } from "./file"
import { MdEditor } from './md-editor'

export default function Page() {
  return (
    <div className="flex h-screen">
      <FileSidebar />
      <MdEditor />
    </div>
  )
}
