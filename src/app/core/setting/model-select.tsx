import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { fetch } from '@tauri-apps/plugin-http'
import useSettingStore from "@/stores/setting";
import { AiConfig, baseAiConfig, Model } from "./config";
import { Input } from "@/components/ui/input";
import { Store } from "@tauri-apps/plugin-store";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from 'next-intl'
import { debounce } from "lodash-es";

export default function ModelSelect() {
  const { aiType, apiKey, model, setModel } = useSettingStore()
  const [list, setList] = useState<Model[]>([])
  const [url, setUrl] = useState<string | undefined>()
  const t = useTranslations('settings.ai')

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

    const requestOptions = {
      method: 'GET',
      headers,
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      setList(result.data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: t('modelList.error.title'),
        description: t('modelList.error.description'),
        variant: "destructive"
      })
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
  }

  async function modelSelectChangeHandler(e: string) {
    syncModelList(e)
  }

  const debouncedCheck = useCallback(debounce(initModelList, 500), [])

  useEffect(() => {
    init()
  }, [aiType])

  useEffect(() => {
    init()
    debouncedCheck()
  }, [url, apiKey])

  return (
    url ? 
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