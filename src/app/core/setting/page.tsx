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
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { debounce, upperFirst } from 'lodash-es'
import { SettingTab } from "./setting-tab"
import { SettingTitle } from "./setting-title"
import { config } from "./config"
import { SettingRender } from "./setting-render"
import { Separator } from "@/components/ui/separator"
import useSettingStore from "@/stores/setting"

const flatConfig = config.flatMap(item => item.settings)

const formSchema = z.object(flatConfig.reduce((acc, item) => {
  return {
    ...acc,
    [item.key]: item.schema,
  };
}, {}))

export default function Page() {
  const [isInitialRender, setIsInitialRender] = useState(false)
  const settingStore = useSettingStore()

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
      }
    }
    setIsInitialRender(true)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const store = await Store.load('store.json');
    for (const [key, value] of Object.entries(values)) {
      await store.set(key, value)
      const storeKey = `set${upperFirst(key)}` as keyof typeof settingStore
      (settingStore[storeKey] as (value: unknown) => void)(value)
      if (isInitialRender) {
        toast({ title: "设置已保存", duration: 2000 })
      }
    }
    await store.save()
  }

  const debounceSubmit = debounce(() => form.handleSubmit(onSubmit)(), 1000)

  useEffect(() => {
    initFormDefaultValues()
  }, [])

  return <div className="flex">
    <SettingTab />
    <Form {...form}>
      <form onChange={debounceSubmit} id="setting-form" className="space-y-4 p-4 flex-1 h-screen overflow-y-scroll">
        {
          config.map(item => {
            return (
              <div key={item.anchor}>
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
                                <FormDescription>{setting.desc}</FormDescription>
                              </div>
                              <FormControl>
                                <SettingRender setting={setting} field={field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {
                          index !== item.settings.length - 1 && <Separator className="my-4" />
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