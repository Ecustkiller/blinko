import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";

const config = [
  {
    key: 'custom',
    title: '自定义',
    baseURL: null,
  },
  {
    key: 'chatgpt',
    title: 'ChatGPT',
    baseURL: null,
  },
  {
    key: 'chatanywhere',
    title: 'ChatAnyWhere',
    baseURL: 'https://api.chatanywhere.tech/v1',
  },
  {
    key: 'volcengine',
    title: '豆包',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  },
  {
    key: 'aliyun',
    title: '通义千问',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  },
  {
    key: 'moonshot',
    title: 'Kimi',
    baseURL: 'https://api.moonshot.cn/v1',
  },
]

export function SettingAI({id, icon}: {id: string, icon?: React.ReactNode}) {
  const [tab, setTab] = useState('custom')
  const { apiKey, setApiKey, baseURL, setBaseURL, model, setModel } = useSettingStore()

  async function tabChangeHandler(tab: string) {
    setTab(tab)
    const store = await Store.load('store.json');
    await store.set('aiType', tab)
    if (tab !== 'custom') {
      const item = config.find((item) => item.key === tab)
      if (item) {
        setBaseURL(item.baseURL || '')
        await store.set('baseURL', item.baseURL)
      }
    } else {
      const baseURL = await store.get<string>('baseURL_custom')
      setBaseURL(baseURL || '')
      await store.set('baseURL', baseURL || '')
    }
    // api key
    const apiKey = await store.get<string>(`apiKey-${tab}`)
    if (apiKey) {
      setApiKey(apiKey)
      await store.set(`apiKey`, apiKey)
    } else {
      setApiKey('')
      await store.set(`apiKey`, '')
    }
    // model
    const model = await store.get<string>(`model-${tab}`)
    if (model) {
      setModel(model)
      await store.set(`model`, model)
    } else {
      setModel('')
      await store.set(`model`, '')
    }
  }

  async function baseURLChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setBaseURL(e.target.value)
    const store = await Store.load('store.json');
    await store.set('baseURL', e.target.value)
    await store.set('baseURL_custom', e.target.value)
  }

  async function apiKeyChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setApiKey(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`apiKey`, e.target.value)
    await store.set(`apiKey-${tab}`, e.target.value)
  }

  async function modelChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setModel(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`model`, e.target.value)
    await store.set(`model-${tab}`, e.target.value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const tab = await store.get<string>('aiType')
      if (tab) {
        setTab(tab)
      }
      const apiKey = await store.get<string>(`apiKey-${tab}`)
      if (apiKey) {
        setApiKey(apiKey)
      }
      const baseURL = await store.get<string>(`baseURL`)
      if (baseURL) {
        setBaseURL(baseURL)
      }
      const model = await store.get<string>(`model-${tab}`)
      if (model) {
        setModel(model)
      }
    }
    init()
  }, [])

  return (
    <SettingType id={id} icon={icon} title="AI">
      <SettingRow>
        <Tabs className="mb-2" value={tab} onValueChange={tabChangeHandler}>
          <TabsList>
            {
              config.map((item) => (
                <TabsTrigger value={item.key} key={item.key}>{item.title}</TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </SettingRow>
      { tab === 'custom' &&
        <SettingRow>
          <FormItem title="BaseURL">
            <Input value={baseURL} onChange={baseURLChangeHandler} disabled={tab !== 'custom'} />
          </FormItem>
        </SettingRow>
      }
      <SettingRow>
        <FormItem title="API Key">
          <Input value={apiKey} onChange={apiKeyChangeHandler} />
        </FormItem>
      </SettingRow>
      <SettingRow>
        <FormItem title="Model">
          <Input value={model} onChange={modelChangeHandler} />
        </FormItem>
      </SettingRow>
    </SettingType>
  )
}