import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function TooltipButton(
  { icon, tooltipText, onClick, disabled = false }:
  { icon: React.ReactNode; tooltipText: string; onClick?: () => void, disabled?: boolean})
{
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button disabled={disabled} size="icon" variant="ghost" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}