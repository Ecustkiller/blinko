import { TooltipButton } from "@/components/tooltip-button"
import { insertMark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { invoke } from "@tauri-apps/api/core"
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { ScanText } from "lucide-react"
import { isRegistered, register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { useEffect } from "react"
 
export function ControlScan() {
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function createScreenShot() {
    const currentWindow = getCurrentWebviewWindow()
    await currentWindow.minimize()

    await invoke('screenshot')
    
    const webview = new WebviewWindow('screenshot', {
      url: '/screenshot',
      decorations: false,
      maximized: true,
    });

    webview.onCloseRequested(async () => {
      await currentWindow.show()
      unlisten()
    })

    const unlisten = await webview.listen("save-success", async e => {
      if (typeof e.payload === 'string') {
        const content = await ocr(`screenshot/${e.payload}`)
        const desc = await fetchAiDesc(content).then(res => res.choices[0].message.content)
        await insertMark({ tagId: currentTagId, type: 'scan', content, url: e.payload, desc })
        await fetchMarks()
        await fetchTags()
        getCurrentTag()
      }
      unlisten()
    });
  }

  async function initRegister() {
    const isEscRegistered = await isRegistered('CommandOrControl+Shift+S');
    if (isEscRegistered) {
      await unregister('CommandOrControl+Shift+S');
    }
    await register('CommandOrControl+Shift+S', async (e) => {
      if (e.state === 'Pressed') {
        await createScreenShot()
      }
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    initRegister()
  }, [])

  return (
    <TooltipButton icon={<ScanText />} tooltipText="截图" onClick={createScreenShot} />
  )
}