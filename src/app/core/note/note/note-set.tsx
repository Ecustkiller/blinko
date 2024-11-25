import { TooltipButton } from "@/components/tooltip-button";
import { Clock, Save, Trash } from "lucide-react";

export function NoteSet() {
  return (
    <div className="flex items-center gap-2">
      <TooltipButton icon={<Clock />} tooltipText="历史笔记" />
      <TooltipButton icon={<Save />} tooltipText="保存笔记" />
      <TooltipButton icon={<Trash />} tooltipText="删除笔记" />
    </div>
  )
}