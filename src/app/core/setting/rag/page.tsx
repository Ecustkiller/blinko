'use client'

import { SettingType } from '../components/setting-base'
import { Drama } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Setting } from './setting'

export default function PromptSetting() {
  const t = useTranslations('settings.rag')
  return <SettingType id="rag" title={t('title')} desc={t('desc')} icon={<Drama />}>
    <Setting />
  </SettingType>
}
