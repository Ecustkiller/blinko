'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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

const formSchema = z.object({
  apiKey: z.string().min(1)
})

export default function Page() {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  })

  async function initFormDefaultValues() {
    const store = await Store.load('store.json');
    const apiKey = await store.get<string>('apiKey')
    if (apiKey) {
      form.setValue('apiKey', apiKey)
    }
  }

  useEffect(() => {
    initFormDefaultValues()
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const store = await Store.load('store.json');
    store.set('apiKey', values.apiKey)
  }

  return <div className="p-4">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API KEY</FormLabel>
              <FormControl>
                <Input placeholder="请输入 API KEY" {...field} />
              </FormControl>
              <FormDescription>
                获取免费试用，https://api.chatanywhere.org/v1/oauth/free/render
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">保存</Button>
      </form>
    </Form>
  </div>
}