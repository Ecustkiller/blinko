'use client';

import { BotMessageSquare } from "lucide-react"
import { SettingAI } from "./setting-ai";

export default function AIPage() {
  return <SettingAI id="ai" icon={<BotMessageSquare />} />
}
