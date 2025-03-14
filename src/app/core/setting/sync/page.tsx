'use client';

import { FileUp } from "lucide-react"
import { SettingSync } from "./setting-sync";

export default function SyncPage() {
  return <SettingSync id="sync" icon={<FileUp />} />
}
