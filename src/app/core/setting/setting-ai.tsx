import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { InfoIcon } from "lucide-react";
import ModelSelect from "./model-select";
import { baseAiConfig } from "./config";

export function SettingAI({id, icon}: {id: string, icon?: React.ReactNode}) {
  const t = useTranslations();
  const aiT = useTranslations('settings.ai');
  const { aiType, setAiType, apiKey, setApiKey, baseURL, setBaseURL, setModel } = useSettingStore()

  // Add translations to the config
  const aiConfig = baseAiConfig.map(item => ({
    ...item,
    title: item.key === 'custom' 
      ? aiT('custom') 
      : aiT(`providers.${item.key}`)
  }))

  async function tabChangeHandler(tab: string) {
    setAiType(tab)
    const store = await Store.load('store.json');
    await store.set('aiType', tab)
    const baseURL = await store.get<string>(`baseURL-${tab}`)
    if (baseURL) {
      setBaseURL(baseURL)
      await store.set(`baseURL`, baseURL)
    } else {
      const defaultBaseURL = baseAiConfig.find((item) => item.key === tab)?.baseURL
      if (defaultBaseURL) {
        setBaseURL(defaultBaseURL)
        await store.set(`baseURL`, defaultBaseURL)
        await store.set(`baseURL-${tab}`, defaultBaseURL)
      }
    }
    const apiKey = await store.get<string>(`apiKey-${tab}`)
    if (apiKey) {
      setApiKey(apiKey)
      await store.set(`apiKey`, apiKey)
      await store.set(`apiKey-${tab}`, apiKey)
    } else {
      setApiKey('')
    }
    const model = await store.get<string>(`model-${tab}`)
    if (model) {
      setModel(model)
      await store.set(`model`, model)
      await store.set(`model-${tab}`, model)
    } else {
      setModel('')
    }
  }

  async function baseURLChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setBaseURL(value)
    const store = await Store.load('store.json');
    await store.set(`baseURL`, value)
    await store.set(`baseURL-${aiType}`, value)
  }

  async function apiKeyChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setApiKey(value)
    const store = await Store.load('store.json');
    await store.set(`apiKey`, value)
    await store.set(`apiKey-${aiType}`, value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const tab = await store.get<string>('aiType')
      if (tab) {
        setAiType(tab)
        const apiKey = await store.get<string>(`apiKey-${tab}`)
        if (apiKey) {
          setApiKey(apiKey)
        }
        const baseURL = await store.get<string>(`baseURL-${tab}`)
        if (baseURL) {
          setBaseURL(baseURL)
        } else {
          const baseURL = baseAiConfig.find((item) => item.key === tab)?.baseURL
          if (baseURL) {
            setBaseURL(baseURL)
          }
        }
        const model = await store.get<string>(`model-${tab}`)
        if (model) {
          setModel(model)
        }
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