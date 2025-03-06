import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { AiConfig } from "../../setting/config"
import { Store } from "@tauri-apps/plugin-store"
import useSettingStore from "@/stores/setting"
import { CircleAlert } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

export function ModelSelect() {
  const [list, setList] = useState<AiConfig[]>([])
  const { aiType, apiKey, setAiType, setModel, setApiKey, setBaseURL } = useSettingStore()
  const t = useTranslations('record.chat.header')
  const router = useRouter()

  async function initModelList() {
    const store = await Store.load('store.json');
    const models = await store.get<AiConfig[]>('aiModelList')
    if (!models) return
    const filteredModels = models.filter(item => {
      return item.apiKey && item.model && item.baseURL
    })
    setList(filteredModels)
  }

  async function modelSelectChangeHandler(e: string) {
    setAiType(e)
    const store = await Store.load('store.json');
    store.set('aiType', e)
    const model = list.find(item => item.key === e)
    if (!model) return
    store.set('model', model.model)
    setModel(model.model || '')
    store.set('apiKey', model.apiKey)
    setApiKey(model.apiKey || '')
    store.set('baseURL', model.baseURL)
    setBaseURL(model.baseURL || '')
  }

  async function toSettingHandler() {
    router.push('/core/setting?anchor=ai', { scroll: false });
  }

  useEffect(() => {
    initModelList()
  }, [])
  return (
    list.length > 0 && apiKey ? (
      <Select value={aiType} onValueChange={modelSelectChangeHandler} disabled={list.length === 0}>
        <SelectTrigger className="border-none shadow-none outline-none ring-0 focus:ring-0 justify-center gap-2">
          <SelectValue placeholder="选择模型" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {
              list?.map((item, index) => {
                return <SelectItem key={index} value={item.key}>{item.model} ({item.title})</SelectItem>
              })
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    ) : (
      <div className="text-red-800 text-sm flex items-center gap-2 justify-center cursor-pointer" onClick={toSettingHandler}>
        <CircleAlert className="size-4" />
        <span>{t('configApiKey')}</span>
      </div>
    )
  )
}
