import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import ConvertHTML from "./convert-html";
import WordsCount from "./words-count";
import "./index.scss"

export default function CustomToolbar({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  return <div className="h-6 w-full border-b flex items-center px-2 gap-1 justify-between">
    <div className="flex h-4 items-center gap-1">
      <ConvertHTML mdRef={mdRef} />
    </div>
    <div>
      <WordsCount />
    </div>
  </div>
}