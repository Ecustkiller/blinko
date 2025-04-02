import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import useSettingStore from "@/stores/setting";
import { AiConfig } from "../config";
import { Input } from "@/components/ui/input";
import { Store } from "@tauri-apps/plugin-store";
import { getModels } from "@/lib/ai";
import OpenAI from "openai";

export default function ModelSelect() {
  const { aiType, apiKey, model, setModel } = useSettingStore()
  const [list, setList] = useState<OpenAI.Models.Model[]>([])

  async function initModelList() {
    console.log('initModelList')
    const models = await getModels()
    console.log(models)
    setList(models)
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
    initModelList()
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
