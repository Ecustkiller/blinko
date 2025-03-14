import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetch, Proxy } from '@tauri-apps/plugin-http'
import useSettingStore from "@/stores/setting";
import { AiConfig, baseAiConfig, Model } from "../config";
import { Input } from "@/components/ui/input";
import { Store } from "@tauri-apps/plugin-store";

export default function ModelSelect() {
  const { aiType, apiKey, model, setModel } = useSettingStore()
  const [list, setList] = useState<Model[]>([])
  const [url, setUrl] = useState<string | undefined>()

  function init() {
    setList([])
    const url = baseAiConfig.find(item => item.key === aiType)?.modelURL
    setUrl(url)
  }

  async function initModelList() {
    if (!apiKey) return
    if (!url) return

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${apiKey}`);
    headers.append("Content-Type", "application/json");
    const store = await Store.load('store.json');
    const proxyUrl = await store.get<string>('proxy')
    const proxy: Proxy | undefined = proxyUrl ? {
      all: proxyUrl
    } : undefined

    const requestOptions = {
      method: 'GET',
      headers,
      proxy
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      setList(result.data || [])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setList([])
    }
  }

  async function syncModelList(value: string) {
    setModel(value)
    const store = await Store.load('store.json');
    await store.set('model', value)

    const aiModelList = await store.get<AiConfig[]>('aiModelList')
    if (!aiModelList) return
    const model = aiModelList.find(item => item.key === aiType)
    if (!model) return
    model.model = value
    aiModelList[aiModelList.findIndex(item => item.key === aiType)] = model
    await store.set('aiModelList', aiModelList)
  }

  useEffect(() => {
    init()
    if (apiKey && url) {
      initModelList()
    }
  }, [apiKey, aiType])
  
  return (
    <div className="flex flex-col">
      {list.length ? (
        <Select defaultValue={model} onValueChange={syncModelList}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder={model || 'Select model'} />
          </SelectTrigger>
          <SelectContent>
            {
              list.map(item => (
                <SelectItem key={item.id} value={item.id}>{item.id}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      ) : (
        <Input value={model} onChange={(e) => syncModelList(e.target.value)} className="w-full mt-2" placeholder="Input model name" />
      )}
    </div>
  )
}
