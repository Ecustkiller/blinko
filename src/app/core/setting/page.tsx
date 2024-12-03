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
import { Input } from "@/components/ui/input"
import { Store } from "@tauri-apps/plugin-store"
import { useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { TriangleAlert } from "lucide-react"
import { OpenBroswer } from "./open-broswer"
import { toast } from "@/hooks/use-toast"
import { debounce } from 'lodash-es'

const formSchema = z.object({
  apiKey: z.string(),
  markDescGen: z.boolean().default(true).optional()
})

export default function Page() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      markDescGen: true
    },
  })

  async function initFormDefaultValues() {
    const store = await Store.load('store.json');
    for (const [key] of Object.entries(form.getValues())) {
      const value = await store.get(key)
      if (key && value !== undefined) {
        form.setValue(key as keyof z.infer<typeof formSchema>, value as string)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const store = await Store.load('store.json');
    for (const [key, value] of Object.entries(values)) {
      await store.set(key, value)
    }
    await store.save()
    toast({ title: "设置已保存", duration: 2000 })
  }

  const debounceSubmit = debounce(() => form.handleSubmit(onSubmit)(), 1000)

  useEffect(() => {
    initFormDefaultValues()
  }, [])

  return <div className="p-4">
    <Form {...form}>
      <form onChange={debounceSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">ChatGPT(ChatAnywhere API)</h2>
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-between rounded-lg border p-3 shadow-sm">
              <FormLabel>API KEY</FormLabel>
              <FormControl>
                <Input placeholder="请输入 API KEY" {...field} />
              </FormControl>
              <FormDescription>
                你需要使用你的 Github 账号绑定来领取你自己的免费Key。<br />
                <OpenBroswer title="申请领取内测免费API Key" url="https://api.chatanywhere.org/v1/oauth/free/render" />或
                <OpenBroswer title="购买内测付费API Key" url="https://buyca.tech/" />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="markDescGen"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>记录 AI 生成描述</FormLabel>
                <FormDescription>
                  <span>截图和插图记录时，生成 AI 描述，而不是展示 OCR 识别的文本，可以更加直观的了解记录的核心内容。</span><br />
                  <span className="flex items-center gap-1 mt-2 text-red-900">
                    <TriangleAlert className="size-4" />开启此项将降低记录生成的速度，并且消耗更多的 API 请求次数，建议免费用户关闭。
                  </span>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  </div>
}