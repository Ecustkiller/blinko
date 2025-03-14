'use client';

import { ScanText } from "lucide-react"
import { SettingOCR } from "./setting-ocr";

export default function OCRPage() {
  return <SettingOCR id="ocr" icon={<ScanText />} />
}
