import Vditor from 'vditor'
import { Separator } from "@/components/ui/separator";
import Toggle from "./toggle";
import Mark from "./mark";
import Question from "./question";
import Continue from "./continue";
import Optimize from "./optimize";
import Eraser from "./eraser";
import Translation from "./translation";
// import Sync from "./sync";
// import History from "./history";
// import Undo from "./undo";
// import Redo from './redo'
// import Preview from "./preview"
// import Check from "./check";

export default function CustomToolbar({editor}: {editor?: Vditor}) {
  return <div className="h-12 w-full border-b items-center px-2 gap-1 justify-between hidden">
    <div className="flex h-4 items-center gap-1">
      <Toggle editor={editor} />
      <Separator orientation="vertical" />
      {/* <Undo editor={editor} /> */}
      {/* <Redo editor={editor} /> */}
      {/* <Separator orientation="vertical" /> */}
      <Mark editor={editor} />
      <Question editor={editor} />
      <Continue editor={editor} />
      <Optimize editor={editor} />
      <Eraser editor={editor} />
      <Translation editor={editor} />
      {/* <Check editor={editor} /> */}
    </div>

    <div className="flex h-4 items-center gap-1">
      {/* <Preview editor={editor} />
      <Separator orientation="vertical" />
      <History editor={editor} />
      <Sync editor={editor} /> */}
    </div>
  </div>
}