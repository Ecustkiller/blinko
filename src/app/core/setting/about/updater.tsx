import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useSettingStore from '@/stores/setting';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ArrowBigRightDash, Loader2 } from 'lucide-react';

export default function Updater() {
    const t = useTranslations('settings.about');
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const { version } = useSettingStore();
    const [update, setUpdate] = useState<Update | null>(null);

    async function checkUpdate() {
      setChecking(true);
      try {
        setUpdate(await check());
      } catch (error) {
        toast({
          title: t('checkError'),
          description: error as string,
          variant: 'destructive'
        });
      } finally {
        setChecking(false);
      }
    }
    
    async function checkVersion() {
      setLoading(true);
      if (update) {
        try {
          await update.downloadAndInstall();
        } catch (error) {
          toast({
            title: t('checkError'),
            description: error as string,
            variant: 'destructive'
          });
        }
        await relaunch();
      } else {
        toast({
          title: t('checkError'),
          description: t('noUpdate'),
          variant: 'default'
        });
        setLoading(false);
      }
    }

    useEffect(() => {
      checkUpdate();
    }, []);

    return (
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <div>
            <Image src="/app-icon.png" alt="logo" className="size-24 dark:invert" width={0} height={0} />
          </div>
          <div className="h-24 flex flex-col justify-between">
            <span className="text-2xl font-bold flex items-center gap-2">NoteGen</span>
            <span>
              {t('desc')}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">v{version}</Badge>
              {
                update ? (
                  <>
                    <ArrowBigRightDash className="size-4" />
                    <Badge className="bg-green-500 text-white" variant="outline">v{update.version}</Badge>
                  </>
                ) : null
              }
            </div>
          </div>
        </div>
        <Button disabled={!update || loading || checking} onClick={checkVersion}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {checking ? t('checkUpdate') : update ? t('updateAvailable') : t('noUpdate')}
        </Button>
      </div>
    )
}