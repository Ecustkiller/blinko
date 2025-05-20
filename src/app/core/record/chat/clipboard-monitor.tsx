"use client"
import { useTranslations } from 'next-intl'
import { Clipboard, ClipboardX } from 'lucide-react'
import { TooltipButton } from '@/components/tooltip-button'
import { useState } from 'react'
import { Store } from '@tauri-apps/plugin-store'

export function ClipboardMonitor() {
  const t = useTranslations('record.chat.input.clipboardMonitor')
  const [isEnabled, setIsEnabled] = useState(true)

  const toggleClipboardMonitor = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    const store = await Store.load('store.json')
    await store.set('clipboardMonitor', newState)
  }

  return (
    <TooltipButton
      variant={"ghost"}
      size="icon"
      icon={isEnabled ? <Clipboard className="size-4" /> : <ClipboardX className="size-4" />}
      tooltipText={isEnabled ? t('enable') : t('disable')}
      onClick={toggleClipboardMonitor}
    />
  )
}
