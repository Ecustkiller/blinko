'use client';

import { Command } from "lucide-react"
import { SettingShortcut } from "./setting-shortcut";

export default function ShortcutPage() {
  return <SettingShortcut id="shortcut" icon={<Command />} />
}
