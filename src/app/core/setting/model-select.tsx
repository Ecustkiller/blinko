import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetch } from '@tauri-apps/plugin-http'
import useSettingStore from "@/stores/setting";
import { aiConfig, Model } from "./config";
import { Input } from "@/components/ui/input";
import { Store } from "@tauri-apps/plugin-store";
import { toast } from "@/hooks/use-toast";

export default function ModelSelect() {
  const { aiType, apiKey, model, setModel } = useSettingStore()
  const [list, setList] = useState<Model[]>([])
  const [url, setUrl] = useState<string | undefined>()

  function init() {
    setList([])
    const url = aiConfig.find(item => item.key === aiType)?.modelURL
    setUrl(url)
  }

  async function initModelList() {
    if (!apiKey) return
    if (!url) return

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${apiKey}`);
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: 'GET',
      headers,
    };

    const res = await fetch(url, requestOptions)
      .then(res => res.json())
      .catch(() => {
        toast({
          title: '获取模型列表失败',
          description: '请检查 API Key 或网络是否正确',
          variant: 'destructive',
        })
      })
    setList(res?.data || [])
  }

  async function modelChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setModel(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`model`, e.target.value)
    await store.set(`model-${aiType}`, e.target.value)
  }

  async function modelSelectChangeHandler(e: string) {
    setModel(e)
    const store = await Store.load('store.json');
    await store.set(`model`, e)
    await store.set(`model-${aiType}`, e)
  }

  useEffect(() => {
    initModelList()
  }, [apiKey])

  useEffect(() => {
    init()
  }, [aiType])

  useEffect(() => {
    init()
    initModelList()
  }, [url])

  return (
    url ? 
    <Select onValueChange={modelSelectChangeHandler} value={model} disabled={!apiKey}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="请选择模型" />
      </SelectTrigger>
      <SelectContent>
        {
          list.map((item, index) => {
            return <SelectItem key={index} value={item.id}>{item.id}</SelectItem>
          })
        }
      </SelectContent>
    </Select> : 
    <Input value={model} onChange={modelChangeHandler} />
  )
}