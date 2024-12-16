import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import Ai from "./ai";
import Optimize from "./optimize";
import Translation from "./translation";
import Sync from "./sync";
import History from "./history";
import { Separator } from "@/components/ui/separator";
import Toggle from "./toggle";
import { Settings } from "./settings.type";

export default function CustomToolbar({mdRef, settings}: {mdRef: RefObject<ExposeParam>, settings: Settings}) {
  return <div className="h-12 w-full border-b flex items-center px-2 gap-1 justify-between">
    <div className="flex h-4 items-center gap-1">
      <Toggle mdRef={mdRef} settings={settings} />
      <Separator orientation="vertical" />
      <Ai mdRef={mdRef} />
      <Optimize mdRef={mdRef} />
      <Translation mdRef={mdRef} />
    </div>

    <div>
      <History mdRef={mdRef} />
      <Sync mdRef={mdRef} />
    </div>
  </div>
}