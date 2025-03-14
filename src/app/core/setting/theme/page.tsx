'use client';

import { Palette } from "lucide-react"
import { SettingTheme } from "./setting-theme";

export default function ThemePage() {
  return <SettingTheme id="theme" icon={<Palette />} />
}
