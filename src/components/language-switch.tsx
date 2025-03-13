import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/useI18n";
import { Languages } from "lucide-react";
import { TooltipButton } from "./tooltip-button";
import { useTranslations } from "next-intl";

export function LanguageSwitch() {
  const { currentLocale, changeLanguage } = useI18n();
  const t = useTranslations('common');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex items-center">
          <TooltipButton icon={<Languages className="h-[1.2rem] w-[1.2rem]" />} tooltipText={t('language')} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English {currentLocale === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("zh")}>
          中文 {currentLocale === "zh" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
