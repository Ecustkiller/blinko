import { TooltipButton } from "@/components/tooltip-button"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { EmitterShortcutEvents } from "@/config/emitters"
import { ShortcutDefault, ShortcutSettings } from "@/config/shortcut"
import { insertMark } from "@/db/marks"
import emitter from "@/lib/emitter"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { isRegistered, register, unregister } from "@tauri-apps/plugin-global-shortcut"
import { Store } from "@tauri-apps/plugin-store"
import { CopySlash } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useRouter, usePathname } from "next/navigation";

export function ControlText() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function handleSuccess() {
    const resetText = text.replace(/'/g, '')
    await insertMark({ tagId: currentTagId, type: 'text', desc: resetText, content: resetText })
    await fetchMarks()
    await fetchTags()
    getCurrentTag()
    setText('')
    setOpen(false)
  }

  async function quickRecord() {
    const currentWindow = getCurrentWindow()
    await currentWindow.show();
    await currentWindow.setFocus();
    if (pathname !== '/core/record') {
      router.push('/core/record')
    }
    setOpen(true)
  }

  async function initRegister() {
    const store = await Store.load('store.json')
    let lastKey = await store.get<string>(ShortcutSettings.text)
    if (!lastKey) {
      await store.set(ShortcutSettings.text, ShortcutDefault.text)
      lastKey = ShortcutDefault.text
    }
    const isEscRegistered = await isRegistered(lastKey);
    if (isEscRegistered) {
      await unregister(lastKey);
    }
    await register(lastKey, async (e) => {
      if (e.state === 'Pressed') {
        quickRecord()
      }
    }).catch(e => console.log(e))
  }

  async function linstenRegister(key?: string) {
    if (!key) return
    const store = await Store.load('store.json')
    const lastKey = await store.get<string>(ShortcutSettings.text)
    if (lastKey) {
      const isEscRegistered = await isRegistered(lastKey);
      if (isEscRegistered) {
        await unregister(lastKey);
      }
    }
    await store.set(ShortcutSettings.text, key)
    await register(key, async (e) => {
      if (e.state === 'Pressed') {
        quickRecord()
      }
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    initRegister()
    emitter.on(EmitterShortcutEvents.text, (res) => linstenRegister(res as string))
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipButton icon={<CopySlash />} tooltipText={t('record.mark.type.text')} />
      </DialogTrigger>
      <DialogContent className="min-w-[650px]">
        <DialogHeader>
          <DialogTitle>{t('record.mark.text.title')}</DialogTitle>
          <DialogDescription>
            {t('record.mark.text.description')}
          </DialogDescription>
        </DialogHeader>
        <Textarea id="username" rows={10} defaultValue={text} onChange={(e) => setText(e.target.value)} />
        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-zinc-500 mr-4">{t('record.mark.text.characterCount', { count: text.length })}</p>
          <Button type="submit" onClick={handleSuccess}>{t('record.mark.text.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

