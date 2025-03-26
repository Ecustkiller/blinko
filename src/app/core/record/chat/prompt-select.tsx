import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Drama } from "lucide-react"
import usePromptStore from "@/stores/prompt"

export function PromptSelect() {
  const { promptList, currentPrompt, initPromptData, setCurrentPrompt } = usePromptStore()
  const t = useTranslations('record.chat.header')

  // 初始化面具列表
  useEffect(() => {
    initPromptData()
  }, [])

  // 选择面具
  async function promptSelectChangeHandler(id: string) {
    const selectedPrompt = promptList.find(item => item.id === id)
    if (!selectedPrompt) return
    await setCurrentPrompt(selectedPrompt)
  }

  return (
    <Select 
      value={currentPrompt?.id} 
      onValueChange={promptSelectChangeHandler} 
    >
      <SelectTrigger className="border-none shadow-none outline-none ring-0 justify-start w-auto focus:ring-0 gap-2">
        <Drama className="size-4" />
        <SelectValue placeholder={t('selectPrompt') || '选择面具'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            promptList?.map((item) => {
              return <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
            })
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
