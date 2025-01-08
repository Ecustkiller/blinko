import { TooltipButton } from "@/components/tooltip-button";
import { Redo2Icon } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { redo } from '@codemirror/commands'

export default function Redo({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  async function handler() {
    const cordemirror = mdRef.current?.getEditorView()
    if (!cordemirror) return
    redo(cordemirror)
    mdRef.current?.focus()
  }
  return (
    <TooltipButton icon={<Redo2Icon />} tooltipText="前进" onClick={handler}>
    </TooltipButton>
  )
}