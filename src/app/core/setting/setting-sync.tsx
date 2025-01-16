'use client'
import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import useSyncStore, { SyncStateEnum } from "@/stores/sync";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenBroswer } from "@/components/open-broswer";
import dayjs from "dayjs";
import zh from "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
dayjs.locale(zh)

export function SettingSync({id, icon}: {id: string, icon?: React.ReactNode}) {
  const { accessToken, setAccessToken } = useSettingStore()
  const {
    imageRepoState,
    setImageRepoState,
    syncRepoState,
    setSyncRepoState,
    imageRepoInfo,
    syncRepoInfo,
    setImageRepoInfo,
    setSyncRepoInfo
  } = useSyncStore()

  async function tokenChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === '') {
      setImageRepoState(SyncStateEnum.fail)
      setSyncRepoState(SyncStateEnum.fail)
      setImageRepoInfo(undefined)
      setSyncRepoInfo(undefined)
    }
    setAccessToken(value)
    const store = await Store.load('store.json');
    await store.set('accessToken', value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const token = await store.get<string>('accessToken')
      if (token) {
        setAccessToken(token)
      } else {
        setAccessToken('')
      }
    }
    init()
  }, [])

  return (
    <SettingType id={id} icon={icon} title="同步">
      <SettingRow>
        <FormItem title="Github Access Token">
          <Input value={accessToken} onChange={tokenChangeHandler} />
        </FormItem>
      </SettingRow>
      <SettingRow>
        <FormItem title="仓库状态">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className={`${syncRepoInfo ? 'border-b' : ''}`}>
                <CardTitle className="flex justify-between items-center">
                  <span>同步仓库（{ syncRepoInfo?.private ? '私有' : '公开' }）</span>
                  <Badge className={`${syncRepoState === SyncStateEnum.success ? 'bg-green-800' : 'bg-red-800'}`}>{syncRepoState}</Badge>
                </CardTitle>
                <CardDescription>同步写作中的 markdown 文件</CardDescription>
              </CardHeader>
              {
                syncRepoInfo &&
                <CardContent>
                  <h3 className="text-xl font-bold mt-4 mb-2">
                    <OpenBroswer title={syncRepoInfo?.full_name || ''} url={syncRepoInfo?.html_url || ''} />
                  </h3>
                  <CardDescription className="flex">
                    <p className="text-zinc-500 leading-6">创建于 { dayjs(syncRepoInfo?.created_at).fromNow() }，</p>
                    <p className="text-zinc-500 leading-6">最后更新于 { dayjs(syncRepoInfo?.updated_at).fromNow() }。</p>
                  </CardDescription>
                </CardContent>
              }
            </Card>
            <Card>
              <CardHeader className={`${imageRepoInfo ? 'border-b' : ''}`}>
                <CardTitle className="flex justify-between items-center">
                  <span>图床仓库 （{ imageRepoInfo?.private ? '私有' : '公开' }）</span>
                  <Badge className={`${imageRepoState === SyncStateEnum.success ? 'bg-green-800' : 'bg-red-800'}`}>{imageRepoState}</Badge>
                </CardTitle>
                <CardDescription>同步你的图片到仓库，使用 jsdelivr 加速。</CardDescription>
              </CardHeader>
              {
                imageRepoInfo &&
                <CardContent>
                  <h3 className="text-xl font-bold mt-4 mb-2">
                    <OpenBroswer title={imageRepoInfo?.full_name || ''} url={imageRepoInfo?.html_url || ''} />
                  </h3>
                  <CardDescription className="flex">
                    <p className="text-zinc-500 leading-6">创建于 { dayjs(imageRepoInfo?.created_at).fromNow() }，</p>
                    <p className="text-zinc-500 leading-6">最后更新于 { dayjs(imageRepoInfo?.updated_at).fromNow() }。</p>
                  </CardDescription>
                </CardContent>
              }
            </Card>
          </div>
        </FormItem>
      </SettingRow>
    </SettingType>
  )
}