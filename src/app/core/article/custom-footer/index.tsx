import Vditor from 'vditor'
import Sync from "./sync";
import History from "./history";
import TextNumber from "./text-number";

export default function CustomFooter({editor}: {editor?: Vditor}) {
  return <div className="h-6 w-full px-2 border-t items-center flex justify-between overflow-hidden">
    <div className="flex items-center gap-1">
      <TextNumber />
    </div>
    <div className="flex items-center gap-1">
      <History editor={editor} />
      <Sync editor={editor} />
    </div>
  </div>
}