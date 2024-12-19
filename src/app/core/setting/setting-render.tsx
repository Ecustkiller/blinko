"use client";

import { Switch } from "@/components/ui/switch";
import { ControllerRenderProps } from "react-hook-form";
import { config } from "./config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "./lanage-select";
import { PreviewThemeSelect } from "./preview-theme-select";
import { CodeThemeSelect } from "./code-theme-select";
import { Badge } from "@/components/ui/badge";
import { ModelSelect } from "./model-select";

export function SettingRender(
  { setting, field }:
  { 
    setting: (typeof config)[number]['settings'][number],
    field: ControllerRenderProps
  }
) {
  switch (setting.type) {
    case 'button':
      return <Button size={'sm'} disabled={setting.disabled}>{setting.value}</Button>
    case 'switch':
      return <Switch checked={field.value} onCheckedChange={field.onChange} disabled={setting.disabled} />
    case 'input':
      return <Input placeholder={`请输入${setting.title}`} {...field} disabled={setting.disabled} />
    case 'select':
      switch (setting.key) {
        case 'language':
          return <LanguageSelect field={field} />
        case 'previewTheme':
          return <PreviewThemeSelect field={field} />
        case 'codeTheme':
          return <CodeThemeSelect field={field} />
        case 'model':
          return <ModelSelect field={field} />
      }
    case 'shortcut':
      return <Badge>{setting.value}</Badge>
  }
}