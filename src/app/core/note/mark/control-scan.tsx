import { TooltipButton } from "@/components/tooltip-button"
import { insertMark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { invoke } from "@tauri-apps/api/core"
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { ScanText } from "lucide-react"
 
export function ControlScan() {
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks } = useMarkStore()

  async function createScreenShot() {
    const currentWindow = getCurrentWebviewWindow()
    await currentWindow.hide()

    await invoke('screenshot')
    
    const webview = new WebviewWindow('screenshot', {
      url: '/screenshot',
      decorations: false,
      maximized: true,
    });

    webview.onCloseRequested(async () => {
      await currentWindow.show()
    })

    const unlisten = await webview.listen("save-success", async e => {
      if (typeof e.payload === 'string') {
        const content = await ocr(`screenshot/${e.payload}`)
        const desc = await fetchAiDesc(content).then(res => res.choices[0].message.content)
        await insertMark({ tagId: currentTagId, type: 'scan', content, url: e.payload, desc })
        await fetchMarks()
        await fetchTags()
        getCurrentTag()
        unlisten()
      }
    });
  }

  return (
    <TooltipButton icon={<ScanText />} tooltipText="截图" onClick={createScreenShot} />
  )
}