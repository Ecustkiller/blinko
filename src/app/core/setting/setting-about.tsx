'use client';

import useSettingStore from "@/stores/setting";
import { OpenBroswer } from "@/components/open-broswer";
import { SettingRow, SettingType } from "./setting-base";
import { useTranslations } from 'next-intl';
import { LanguageSwitch } from "@/components/LanguageSwitch";

export function SettingAbout({id, icon}: {id: string, icon?: React.ReactNode}) {
  const { version } = useSettingStore();
  const t = useTranslations('settings.about');

  return (
    <SettingType id={id} icon={icon} title={t('title')}>
      <SettingRow>
        <span>
          {t('version', { version })}，
          <OpenBroswer title={t('checkReleases')} url="https://github.com/codexu/note-gen/releases" />。
        </span>
        {/* <Button disabled>{t('checkUpdate')}</Button> */}
      </SettingRow>
      <SettingRow>
        <span>{t('language')}</span>
        <LanguageSwitch />
      </SettingRow>
    </SettingType>
  )
}