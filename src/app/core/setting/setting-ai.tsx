import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { InfoIcon } from "lucide-react";

const config = [
  {
    key: 'custom',
    title: '自定义',
    baseURL: null,
  },
  {
    key: 'chatgpt',
    title: 'ChatGPT',
    baseURL: 'https://api.openai.com/v1',
  },
  {
    key: 'chatanywhere',
    title: 'ChatAnyWhere',
    baseURL: 'https://api.chatanywhere.tech/v1',
  },
  {
    key: 'ollama',
    title: 'Ollama',
    baseURL: 'http://localhost:11434',
  },
  {
    key: 'lmstudio',
    title: 'LM Studio',
    baseURL: 'http://localhost:1234/v1',
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
  const { aiType, setAiType, apiKey, setApiKey, baseURL, setBaseURL, model, setModel } = useSettingStore()

  async function tabChangeHandler(tab: string) {
    setAiType(tab)
    const store = await Store.load('store.json');
    await store.set('aiType', tab)
    const baseURL = await store.get<string>(`baseURL-${tab}`)
    if (baseURL) {
      setBaseURL(baseURL)
      await store.set(`baseURL`, baseURL)

    } else {
      const defaultBaseURL = config.find((item) => item.key === tab)?.baseURL
      if (defaultBaseURL) {
        setBaseURL(defaultBaseURL)
        await store.set(`baseURL`, defaultBaseURL)
        await store.set(`baseURL-${tab}`, defaultBaseURL)
      } else {
        setBaseURL('')
        await store.set(`baseURL`, '')
      }
    }
    // api key
    const apiKey = await store.get<string>(`apiKey-${tab}`)
    if (apiKey) {
      setApiKey(apiKey)
      await store.set(`apiKey`, apiKey)
    } else {
      if (tab !== 'ollama') {
        setApiKey('')
        await store.set(`apiKey`, '')
      } else {
        setApiKey(' ')
        await store.set(`apiKey`, ' ')
      }
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
    await store.set(`baseURL-${aiType}`, e.target.value)
  }

  async function apiKeyChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setApiKey(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`apiKey`, e.target.value)
    await store.set(`apiKey-${aiType}`, e.target.value)
  }

  async function modelChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setModel(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`model`, e.target.value)
    await store.set(`model-${aiType}`, e.target.value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const tab = await store.get<string>('aiType')
      if (tab) {
        setAiType(tab)
      }
      const apiKey = await store.get<string>(`apiKey-${tab}`)
      if (apiKey) {
        setApiKey(apiKey)
      }
      const baseURL = await store.get<string>(`baseURL-${tab}`)
      if (baseURL) {
        setBaseURL(baseURL)
      } else {
        const baseURL = config.find((item) => item.key === tab)?.baseURL
        if (baseURL) {
          setBaseURL(baseURL)
        }
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
        <Tabs className="mb-2" value={aiType} onValueChange={tabChangeHandler}>
          <TabsList>
            {
              config.map((item) => (
                <TabsTrigger value={item.key} key={item.key}>{item.title}</TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </SettingRow>
      {
        aiType === 'custom' && (
          <SettingRow>
            <span className="my-2 flex items-center gap-2"><InfoIcon className="size-4" />仅支持 openai 协议的 AI 模型。</span>
          </SettingRow>
        )
      }
      <SettingRow>
        <FormItem title="BaseURL">
          <Input value={baseURL} onChange={baseURLChangeHandler} />
        </FormItem>
      </SettingRow>
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