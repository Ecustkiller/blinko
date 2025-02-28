import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { InfoIcon } from "lucide-react";
import ModelSelect from "./model-select";
import { aiConfig } from "./config";


export function SettingAI({id, icon}: {id: string, icon?: React.ReactNode}) {
  const t = useTranslations();
  const { aiType, setAiType, apiKey, setApiKey, baseURL, setBaseURL, setModel } = useSettingStore()

  async function tabChangeHandler(tab: string) {
    setAiType(tab)
    const store = await Store.load('store.json');
    await store.set('aiType', tab)
    const baseURL = await store.get<string>(`baseURL-${tab}`)
    if (baseURL) {
      setBaseURL(baseURL)
      await store.set(`baseURL`, baseURL)

    } else {
      const defaultBaseURL = aiConfig.find((item) => item.key === tab)?.baseURL
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
    await store.set(`baseURL-${aiType}`, e.target.value)
  }

  async function apiKeyChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setApiKey(e.target.value)
    const store = await Store.load('store.json');
    await store.set(`apiKey`, e.target.value)
    await store.set(`apiKey-${aiType}`, e.target.value)
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
        const baseURL = aiConfig.find((item) => item.key === tab)?.baseURL
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
    <SettingType id={id} icon={icon} title={t('settings.ai.title')}>
      <SettingRow>
        <Tabs className="mb-2" value={aiType} onValueChange={tabChangeHandler}>
          <TabsList>
            {
              aiConfig.map((item) => (
                <TabsTrigger value={item.key} key={item.key}>{item.title}</TabsTrigger>
              ))
            }
          </TabsList>
        </Tabs>
      </SettingRow>
      {
        aiType === 'custom' && (
          <SettingRow>
            <span className="my-2 flex items-center gap-2"><InfoIcon className="size-4" />{t('settings.ai.modelSupport')}</span>
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
          <ModelSelect />
        </FormItem>
      </SettingRow>
    </SettingType>
  )
}