"use client";

import { Switch } from "@/components/ui/switch";
import { ControllerRenderProps } from "react-hook-form";
import { config } from "./config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingRender(
  { setting, field }:
  { 
    setting: (typeof config)[number]['settings'][number],
    field: ControllerRenderProps
  }
) {
  switch (setting.type) {
    case 'button':
      return <Button size={'sm'}>{setting.value}</Button>
    case 'switch':
      return <Switch checked={field.value} onCheckedChange={field.onChange} />
    case 'input':
      return <Input placeholder={`请输入${setting.title}`} {...field} />
  }
}