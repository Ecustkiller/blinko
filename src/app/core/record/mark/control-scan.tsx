import { TooltipButton } from "@/components/tooltip-button"
import { insertMark } from "@/db/marks"
import { fetchAiDesc } from "@/lib/ai"
import ocr from "@/lib/ocr"
import useMarkStore from "@/stores/mark"
import useTagStore from "@/stores/tag"
import { invoke } from "@tauri-apps/api/core"
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { currentMonitor } from '@tauri-apps/api/window';
import { ScanText } from "lucide-react"
import { isRegistered, register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { useEffect } from "react"
import { v4 as uuid } from 'uuid'
import useSettingStore from "@/stores/setting"
 
export function ControlScan() {
  const { currentTagId, fetchTags, getCurrentTag } = useTagStore()
  const { fetchMarks, addQueue, setQueue, removeQueue } = useMarkStore()
  const { apiKey, markDescGen } = useSettingStore()

  async function createScreenShot() {
    const currentWindow = getCurrentWebviewWindow()
    await currentWindow.hide()

    await invoke('screenshot')
    
    const monitor = await currentMonitor();
    
    const webview = new WebviewWindow('screenshot', {
      url: '/screenshot',
      decorations: false,
      x: 0,
      y: 0,
      width: monitor?.size.width,
      height: monitor?.size.height,
    });

    webview.onCloseRequested(async () => {
      if (!await currentWindow.isVisible()) {
        await currentWindow.show()
      } else {
        await currentWindow.setFocus()
      }
      unlisten()
    })

    const unlisten = await webview.listen("save-success", async e => {
      if (typeof e.payload === 'string') {
        const queueId = uuid()
        addQueue({ queueId, progress: ' OCR 识别', type: 'scan', startTime: Date.now() })
        const content = await ocr(`screenshot/${e.payload}`)
        let desc = ''
        if (apiKey && markDescGen) {
          setQueue(queueId, { progress: ' AI 内容识别' });
          desc = await fetchAiDesc(content).then(res => res ? res.choices[0].message.content : content)
        } else {
          desc = content
        }
        setQueue(queueId, { progress: '保存' });
        await insertMark({ tagId: currentTagId, type: 'scan', content, url: e.payload, desc })
        removeQueue(queueId)
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