import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetch, Proxy } from '@tauri-apps/plugin-http'
import useSettingStore from "@/stores/setting";
import { AiConfig, baseAiConfig, Model } from "./config";
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
    const models = await store.get<AiConfig[]>('aiModelList')
    if (!models) return
    models[models.findIndex(item => item.key === aiType)].model = value
    await store.set('aiModelList', models)
  }

  async function modelChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    syncModelList(e.target.value)
    const store = await Store.load('store.json');
    await store.set('model', e.target.value)
  }

  async function modelSelectChangeHandler(e: string) {
    syncModelList(e)
    const store = await Store.load('store.json');
    await store.set('model', e)
  }

  useEffect(() => {
    init()
    initModelList()
  }, [aiType, url, apiKey])

  return (
    list.length ? 
    <Select onValueChange={modelSelectChangeHandler} value={model} disabled={!apiKey}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="请选择模型" />
      </SelectTrigger>
      <SelectContent>
        {
          list?.map((item, index) => {
            return <SelectItem key={index} value={item.id}>{item.id}</SelectItem>
          })
        }
      </SelectContent>
    </Select> : 
    <Input value={model} onChange={modelChangeHandler} />
  )
}