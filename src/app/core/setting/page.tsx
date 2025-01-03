'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Store } from "@tauri-apps/plugin-store"
import { useCallback, useEffect, useState } from "react"
import { debounce, upperFirst } from 'lodash-es'
import { SettingTab } from "./setting-tab"
import { SettingTitle } from "./setting-title"
import { config } from "./config"
import { SettingRender } from "./setting-render"
import { Separator } from "@/components/ui/separator"
import useSettingStore from "@/stores/setting"
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast"

const flatConfig = config.flatMap(item => item.settings)

const formSchema = z.object(flatConfig.reduce((acc, item) => {
  return {
    ...acc,
    [item.key]: item.schema,
  };
}, {}))

let isInit = false

export default function Page() {
  const [currentAnchor, setCurrentAnchor] = useState('about')
  const [showOutline, setShowOutline] = useState(false)
  const settingStore = useSettingStore()
  const parmas = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: flatConfig.reduce((acc, item) => {
      return {
        ...acc,
        [item.key]: item.value,
      };
    }, {})
  })

  async function initFormDefaultValues() {
    const store = await Store.load('store.json');
    for (const [key] of Object.entries(form.getValues())) {
      const value = await store.get(key)
      if (key && value !== undefined) {
        form.setValue(key as keyof z.infer<typeof formSchema>, value as never)
        const storeKey = `set${upperFirst(key)}` as keyof typeof settingStore
        (settingStore[storeKey] as (value: unknown) => void)(value)
      }
    }
    setTimeout(() => {
      isInit = true
    }, 500);
  }

  async function submitHandler(values: z.infer<typeof formSchema>) {
    for (const [key, value] of Object.entries(values)) {
      const checkKey = key as keyof typeof settingStore
      const checkValue = settingStore[checkKey]
      if (checkValue !== value) {
        const store = await Store.load('store.json');
        await store.set(key, value)
        const storeKey = `set${upperFirst(key)}` as keyof typeof settingStore
        (settingStore[storeKey] as (value: unknown) => void)(value)
        await store.save()
      }
    }
  }

  useEffect(() => {
    initFormDefaultValues()
  }, [])

  useEffect(() => {
    const anchor = parmas.get('anchor')
    if (anchor) {
      setCurrentAnchor(anchor)
      setShowOutline(true)
      setTimeout(() => {
        setShowOutline(false)
      }, 2000);
    }
  }, [parmas])

  const debounceToast = useCallback(debounce(() => {
    toast({
      title: '设置已保存',
      variant: 'default',
      duration: 1000,
    })
  }, 1000), [])

  useEffect(() => {
    if (isInit) {
      debounceToast()
    }
  }, [settingStore])

  return <div className="flex">
    <SettingTab />
    <Form {...form}>
      <form onChange={() => form.handleSubmit(submitHandler)()} id="setting-form" className="space-y-4 p-2 flex-1 h-screen overflow-y-scroll">
        {
          config.map(item => {
            return (
              <div key={item.anchor} className={`${item.anchor === currentAnchor ? showOutline ? 'outline-dashed' : '' : ''} p-2`}>
                <SettingTitle title={item.title} anchor={item.anchor} icon={item.icon} />
                {
                  item.settings.map((setting, index) => {  
                    return (
                      <div key={setting.key}>
                        <FormField
                          control={form.control}
                          name={setting.key as never}
                          render={({ field }) => (
                            <FormItem className={`${setting.layout === 'horizontal' ? 'flex-row items-center' : 'flex-col'} flex justify-between mt-4`}>
                              <div>
                                <FormLabel>{setting.title}</FormLabel>
                                <FormDescription className="my-1">{setting.desc}</FormDescription>
                              </div>
                              <FormControl>
                                <SettingRender setting={setting} field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {
                          index !== item.settings.length - 1 && <Separator className="my-2" />
                        }
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </form>
    </Form>
  </div>
}