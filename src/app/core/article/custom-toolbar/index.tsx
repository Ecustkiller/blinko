import Vditor from 'vditor'
import { Separator } from "@/components/ui/separator";
import Toggle from "./toggle";
import Mark from "./mark";
import Question from "./question";
import Continue from "./continue";
import Optimize from "./optimize";
import Eraser from "./eraser";
import Translation from "./translation";
import Sync from "./sync";
import History from "./history";

export default function CustomToolbar({editor}: {editor?: Vditor}) {
  return <div className="h-12 w-full border-b items-center px-2 gap-1 justify-between hidden">
    <Toggle editor={editor} />
    <Separator orientation="vertical" />
    <Mark editor={editor} />
    <Question editor={editor} />
    <Continue editor={editor} />
    <Optimize editor={editor} />
    <Eraser editor={editor} />
    <Translation editor={editor} />
    <History editor={editor} />
    <Sync editor={editor} />
  </div>
}