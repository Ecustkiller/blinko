import { TooltipButton } from "@/components/tooltip-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Store } from "@tauri-apps/plugin-store";
import Vditor from "vditor";

export default function Toggle({editor}: {editor?: Vditor}) {
  const [value, setValue] = useState(false)
  
  async function initValue() {
    const store = await Store.load('store.json')
    const toolbarState = await store.get<boolean>('toolbarState') || false
    setValue(toolbarState)
    if (toolbarState) {
      editor?.updateToolbarConfig({hide: false})
    } else {
      editor?.updateToolbarConfig({hide: true})
    }
  }

  useEffect(() => {
    initValue()
  }, [editor])

  async function handleSet() {
    const store = await Store.load('store.json')
    if (value) {
      await store.set('toolbarState', false)
      editor?.updateToolbarConfig({hide: true})
    } else {
      await store.set('toolbarState', true)
      editor?.updateToolbarConfig({hide: false})
    }
  }
  async function handleToggle() {
    editor?.focus()
    setValue(!value)
    handleSet()
  }
  return (
    <TooltipButton
      icon={value ? <ChevronUp /> : <ChevronDown />}
      tooltipText={value ? '隐藏工具栏': '展开工具栏'}
      onClick={handleToggle}
    >
    </TooltipButton>
  )
}