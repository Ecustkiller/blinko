import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import Ai from "./ai";
import Optimize from "./optimize";
import Translation from "./translation";
import Sync from "./sync";
import History from "./history";

export default function CustomToolbar({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  return <div className="h-12 w-full border-b flex items-center px-2 gap-1 justify-between">
    <div>
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