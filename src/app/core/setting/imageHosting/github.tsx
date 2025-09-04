'use client'
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenBroswer } from "@/components/open-broswer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Switch } from "@/components/ui/switch";
import { getUserInfo } from "@/lib/github";
import { RepoNames, SyncStateEnum } from "@/lib/github.types";
import useImageStore from "@/stores/imageHosting";
import { createImageRepo, checkImageRepoState } from "@/lib/imageHosting/github";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime)

export function GithubImageHosting() {

  const t = useTranslations();
  const { setImageRepoUserInfo, mainImageHosting, setMainImageHosting } = useImageStore()
  const [accessTokenVisible, setAccessTokenVisible] = useState(false)

  const {
    githubImageAccessToken,
    setGithubImageAccessToken,
    useImageRepo,
    jsdelivr,
    setJsdelivr,
  } = useSettingStore()
  const {
    imageRepoState,
    setImageRepoState,
    imageRepoInfo,
    setImageRepoInfo,
  } = useImageStore()

  // 检查 GitHub 仓库状态
  async function checkGithubRepos() {
    try {
      setImageRepoState(SyncStateEnum.checking)
      const store = await Store.load('store.json');
      const accessToken = await store.get<string>('githubImageAccessToken')
      const userInfo = await getUserInfo(accessToken);
      if (!userInfo) return;
      setImageRepoUserInfo(userInfo)
      // 检查图床仓库状态
      const imageRepo = await checkImageRepoState(RepoNames.image)
      if (imageRepo) {
        setImageRepoInfo(imageRepo)
        setImageRepoState(SyncStateEnum.success)
      } else {
        setImageRepoState(SyncStateEnum.creating)
        const info = await createImageRepo(RepoNames.image)
        if (info) {
          setImageRepoInfo(info)
          setImageRepoState(SyncStateEnum.success)
        } else {
          setImageRepoState(SyncStateEnum.fail)
        }
      }
    } catch (err) {
      console.error('Failed to check GitHub repos:', err)
      setImageRepoState(SyncStateEnum.fail)
    }
  }

  async function tokenChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === '') {
      setImageRepoState(SyncStateEnum.fail)
      setImageRepoInfo(undefined)
    }
    await setGithubImageAccessToken(value)
    if (value) {
      checkGithubRepos()
    }
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const token = await store.get<string>('githubImageAccessToken')
      if (token) {
        await setGithubImageAccessToken(token)
        checkGithubRepos()
      } else {
        await setGithubImageAccessToken('')
      }
    }
    init()
  }, [])

  const getStatusIcon = () => {
    switch (imageRepoState) {
      case SyncStateEnum.success:
        return <CheckCircle className="size-4 text-green-500" />;
      case SyncStateEnum.checking:
        return <Loader2 className="size-4 animate-spin text-blue-500" />;
      case SyncStateEnum.creating:
        return <Loader2 className="size-4 animate-spin text-yellow-500" />;
      case SyncStateEnum.fail:
      default:
        return <XCircle className="size-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (imageRepoState) {
      case SyncStateEnum.success:
        return '已连接';
      case SyncStateEnum.checking:
        return '检测中';
      case SyncStateEnum.creating:
        return '创建中';
      case SyncStateEnum.fail:
      default:
        return '未连接';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>GitHub 图床</CardTitle>
            <CardDescription>
              使用 GitHub 仓库作为图片存储服务
            </CardDescription>
          </div>
          {imageRepoInfo && (
            <Button 
              onClick={() => setMainImageHosting('github')}
              disabled={mainImageHosting === 'github' || !githubImageAccessToken || imageRepoState !== SyncStateEnum.success}
              size="sm"
            >
              {mainImageHosting === 'github' ? 
                '当前主要图床' : 
                t('settings.imageHosting.setPrimaryBackup')
              }
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 状态显示 */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">连接状态</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>

        {/* Access Token 配置 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub Access Token</label>
          <p className="text-xs text-muted-foreground">{t('settings.sync.newTokenDesc')}</p>
          <OpenBroswer url="https://github.com/settings/tokens/new" title={t('settings.sync.newToken')} className="mb-2" />
          <div className="flex gap-2">
            <Input 
              value={githubImageAccessToken} 
              onChange={tokenChangeHandler} 
              type={accessTokenVisible ? 'text' : 'password'} 
              placeholder="输入 GitHub Access Token"
            />
            <Button variant="outline" size="icon" onClick={() => setAccessTokenVisible(!accessTokenVisible)}>
              {accessTokenVisible ? <Eye /> : <EyeOff />}
            </Button>
          </div>
        </div>

        {/* 仓库信息 */}
        {imageRepoInfo && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('settings.sync.repoStatus')}</label>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={imageRepoInfo?.owner.avatar_url || ''} />
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                    <OpenBroswer title={imageRepoInfo?.full_name || ''} url={imageRepoInfo?.html_url || ''} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.sync.createdAt', { time: dayjs(imageRepoInfo?.created_at).fromNow() })}，
                    {t('settings.sync.updatedAt', { time: dayjs(imageRepoInfo?.updated_at).fromNow() })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSDelivr 设置 */}
        {imageRepoInfo && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">{t('settings.sync.jsdelivrSetting')}</label>
                <p className="text-xs text-muted-foreground">{t('settings.sync.jsdelivrSettingDesc')}</p>
              </div>
              <Switch 
                checked={jsdelivr} 
                onCheckedChange={(checked) => setJsdelivr(checked)} 
                disabled={!githubImageAccessToken || imageRepoState !== SyncStateEnum.success || !useImageRepo}
              />
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}