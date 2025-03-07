import { SidebarMenuButton } from "./ui/sidebar";
import { createSyncRepo, checkSyncRepoState, getUserInfo } from "@/lib/github";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import useSettingStore from "@/stores/setting";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleUserRound, LoaderPinwheel, Power } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { UserInfo } from "@/lib/github.types";
import { Button } from "./ui/button";
import { OpenBroswer } from "@/components/open-broswer";
import { useRouter } from "next/navigation";
import { RepoNames } from "@/lib/github.types";
import useSyncStore, { SyncStateEnum } from "@/stores/sync";

export default function AppStatus() {
  const t = useTranslations();
  const { accessToken, setGithubUsername } = useSettingStore()
  const { userInfo, setUserInfo } = useSyncStore()
  const [loading, setLoading] = useState(false)
  const {
    imageRepoState,
    setImageRepoState,
    setImageRepoInfo,
    syncRepoState,
    setSyncRepoState,
    setSyncRepoInfo
  } = useSyncStore()

  const router = useRouter()

  async function handleGetUserInfo() {
    setImageRepoState(SyncStateEnum.checking)
    setSyncRepoState(SyncStateEnum.checking)
    const res = await getUserInfo()
    if (res) {
      setUserInfo(res.data as UserInfo)
      setGithubUsername(res.data.login)
    } else {
      setUserInfo(undefined)
    }
    await checkSyncRepoState(RepoNames.image).then((res) => {
      if (res) {
        setImageRepoInfo(res.data)
      }
      setImageRepoState(SyncStateEnum.success)
    }).catch(async () => {
      setImageRepoState(SyncStateEnum.creating)
      const info = await createSyncRepo(RepoNames.image)
      setImageRepoInfo(info)
      setImageRepoState(SyncStateEnum.success)
    })
    
    await checkSyncRepoState(RepoNames.sync).then((res) => {
      if (res) {
        setSyncRepoInfo(res.data)
      }
      setSyncRepoState(SyncStateEnum.success)
    }).catch(async () => {
      setSyncRepoState(SyncStateEnum.creating)
      const info = await createSyncRepo(RepoNames.sync, true)
      setSyncRepoInfo(info)
      setSyncRepoState(SyncStateEnum.success)
    })
    setLoading(false)
  }

  function routerToSetting() {
    router.push('/core/setting?anchor=sync', { scroll: false });
  }

  useEffect(() => {
    if (accessToken) {
      handleGetUserInfo()
    } else {
      setUserInfo(undefined)
    }
  }, [accessToken])

  return <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
    <Avatar>
      <Popover>
        <PopoverTrigger asChild>
          <AvatarImage src={userInfo?.avatar_url} className="cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <div className="p-4 border-b flex items-center gap-2">
            <Avatar>
              <AvatarImage src={userInfo?.avatar_url} />
            </Avatar>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold">{userInfo?.login}</h3>
              <span className="text-xs">{userInfo?.email}</span>
            </div>
          </div>
          <div className="p-4 border-b text-xs flex justify-between gap-2">
            <span className="mr-4 font-bold">{t('sync.status')}</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <Power className={`${imageRepoState === SyncStateEnum.success ? 'text-green-500' : 'text-red-500'} size-3`} />
                <OpenBroswer title={t('sync.imageRepo')} url={`https://github.com/${userInfo?.login}/${RepoNames.image}`} />
              </span>
              <span className="flex items-center gap-1">
                <Power className={`${syncRepoState === SyncStateEnum.success ? 'text-green-500' : 'text-red-500'} size-3`} />
                <OpenBroswer title={t('sync.articleRepo')} url={`https://github.com/${userInfo?.login}/${RepoNames.sync}`} />
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <AvatarFallback className="rounded-none">
        <Button size="icon" onClick={routerToSetting}>
          {
            loading ? 
              <LoaderPinwheel className={`${loading ? 'animate-spin' : ''}`} /> :
              <CircleUserRound />
          }
        </Button>
      </AvatarFallback>
    </Avatar>
  </SidebarMenuButton>
}