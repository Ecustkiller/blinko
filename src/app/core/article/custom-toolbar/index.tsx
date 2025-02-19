// import Question from "./question";
// import Optimize from "./optimize";
// import Translation from "./translation";
// import Sync from "./sync";
// import History from "./history";
// import { Separator } from "@/components/ui/separator";
// import Continue from "./continue";
// import Mark from "./mark";
// import Eraser from "./eraser";
// import Undo from "./undo";
// import Redo from './redo'
// import Preview from "./preview"
import Toggle from "./toggle";
// import Check from "./check";
import Vditor from 'vditor'

export default function CustomToolbar({editor}: {editor?: Vditor}) {
  return <div className="h-12 w-full border-b flex items-center px-2 gap-1 justify-between">
    <div className="flex h-4 items-center gap-1">
      <Toggle editor={editor} />
      {/* <Separator orientation="vertical" />
      <Undo mdRef={mdRef} />
      <Redo mdRef={mdRef} />
      <Separator orientation="vertical" />
      <Mark mdRef={mdRef} />
      <Question mdRef={mdRef} />
      <Continue mdRef={mdRef} />
      <Optimize mdRef={mdRef} />
      <Eraser mdRef={mdRef} />
      <Translation mdRef={mdRef} />
      <Check mdRef={mdRef} /> */}
    </div>

    <div className="flex h-4 items-center gap-1">
      {/* <Preview mdRef={mdRef} />
      <Separator orientation="vertical" />
      <History mdRef={mdRef} />
      <Sync mdRef={mdRef} /> */}
    </div>
  </div>
}