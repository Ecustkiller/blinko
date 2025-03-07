import { fetchAi } from "@/lib/ai";
import emitter from "@/lib/emitter";
import { useEffect } from "react";
import Vditor from "vditor";

export default function Continue({editor}: {editor?: Vditor}) {

  async function handler() {
    editor?.disabled()
    const button = (editor?.vditor.toolbar?.elements?.continue.childNodes[0] as HTMLButtonElement)
    button.classList.add('vditor-menu--disabled')
    const content = editor?.getValue()
    editor?.focus()
    if (!content) return
    const selection = document.getSelection();
    const anchorOffset = selection?.anchorOffset
    const startContent = content.slice(0, anchorOffset);
    const endContent = content.slice(anchorOffset, content.length);
    const req = `
      根据前文：“${startContent}” 内容，直接返回续写内容，不要超过100字。
      内容可以参考后文：“${endContent}”，不要与后文内容重复。
    `
    const res = await fetchAi(req)
    editor?.insertValue(res)
    button.classList.remove('vditor-menu--disabled')
    editor?.enable()
  }

  useEffect(() => {
    emitter.on('toolbar-continue', handler)
    return () => {
      emitter.off('toolbar-continue', handler)
    }
  }, [])

  return (
    <></>
  )
}