import { TooltipButton } from "@/components/tooltip-button";
import { Undo2Icon } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject } from "react";
import { undo } from '@codemirror/commands'

export default function Undo({editor}: {editor?: Vditor}) {
  async function handler() {
    const cordemirror = mdRef.current?.getEditorView()
    if (!cordemirror) return
    undo(cordemirror)
    editor?.focus()
  }
  return (
    <TooltipButton icon={<Undo2Icon />} tooltipText="后退" onClick={handler}>
    </TooltipButton>
  )
}