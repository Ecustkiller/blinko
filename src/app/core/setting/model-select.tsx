import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";
import { fetchAiModels } from "@/lib/ai";
import { useCallback, useEffect, useState } from "react";
import { AiModel } from "@/lib/ai.types";
import { Store } from "@tauri-apps/plugin-store";
import useSettingStore from "@/stores/setting";
import { toast } from "@/hooks/use-toast";
import { debounce } from "lodash-es";

export function ModelSelect({ field }: { field: ControllerRenderProps }) {
  const [models, setModels] = useState<AiModel[]>([])
  const [defaultModel, setDefaultModel] = useState<string>('')
  const { apiKey } = useSettingStore()

  async function init() {
    const store = await Store.load('store.json');
    const value = await store.get('model')
    if (value) {
      setDefaultModel(value as string)
    }
    const res = (await fetchAiModels()) as {
      data: AiModel[]
    }
    if ('error' in res) {
      toast({
        title: '获取模型失败',
        description: (res as { error: { message: string } }).error.message,
        variant: 'destructive',
        duration: 2000,
      })
    } else {
      res.data = res.data.filter((model, index, self) => {
        return index === self.findIndex((m) => {
          return m.id === model.id
        })
      })
      res.data.sort((a, b) => {
        return a.id.localeCompare(b.id)
      })
      setModels(res.data)
    }
  }

  const debounceInit = useCallback(debounce(init, 1000), []);

  function changeHandler(value: string) {
    if (value) {
      field.onChange(value)
    }
  }

  useEffect(() => {
    if (apiKey) debounceInit()
  }, [apiKey])

  return (
    <Select onValueChange={changeHandler} value={field.value} defaultValue={defaultModel} disabled={models.length === 0}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择模型" />
      </SelectTrigger>
      <SelectContent>
        {
          models.map((model) => (
            <SelectItem key={model.id + model.created} value={model.id}>{model.id}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}