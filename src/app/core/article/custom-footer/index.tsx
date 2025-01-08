import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import ConvertHTML from "./convert-html";
import WordsCount from "./words-count";
import SyncState from "./sync-state";
import FileState from "./file-state";
import "./index.scss"

export default function CustomToolbar({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  return <div className="h-6 w-full border-b flex items-center px-4 gap-1 justify-between">
    <div className="flex h-3.5 items-center gap-4 text-xs text-zinc-500">
      <SyncState />
      <FileState />
      <WordsCount />
    </div>
    <div>
      <ConvertHTML mdRef={mdRef} />
    </div>
  </div>
}