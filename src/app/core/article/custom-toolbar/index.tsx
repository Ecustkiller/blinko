import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import Question from "./question";
import Optimize from "./optimize";
import Translation from "./translation";
import Sync from "./sync";
import History from "./history";
import { Separator } from "@/components/ui/separator";
import Toggle from "./toggle";
import { Settings } from "./settings.type";
import Continue from "./continue";
import Mark from "./mark";
import Eraser from "./eraser";

export default function CustomToolbar({mdRef, settings}: {mdRef: RefObject<ExposeParam>, settings: Settings}) {
  return <div className="h-12 w-full border-b flex items-center px-2 gap-1 justify-between">
    <div className="flex h-4 items-center gap-1">
      <Toggle mdRef={mdRef} settings={settings} />
      <Separator orientation="vertical" />
      <Question mdRef={mdRef} />
      <Continue mdRef={mdRef} />
      <Mark mdRef={mdRef} />
      <Separator orientation="vertical" />
      <Optimize mdRef={mdRef} />
      <Eraser mdRef={mdRef} />
      <Translation mdRef={mdRef} />
    </div>

    <div>
      <History mdRef={mdRef} />
      <Sync mdRef={mdRef} />
    </div>
  </div>
}