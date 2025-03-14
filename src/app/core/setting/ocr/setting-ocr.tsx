import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "../components/setting-base";
import { useTranslations } from 'next-intl';
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { OpenBroswer } from "@/components/open-broswer";

export function SettingOCR({id, icon}: {id: string, icon?: React.ReactNode}) {
  const t = useTranslations();
  const { tesseractList, setTesseractList } = useSettingStore()

  async function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setTesseractList(e.target.value)
    const store = await Store.load('store.json');
    await store.set('tesseractList', e.target.value)
  }

  useEffect(() => {
    async function init() {
      const store = await Store.load('store.json');
      const list = await store.get<string>('tesseractList')
      if (list) {
        setTesseractList(list)
      } else {
        setTesseractList('')
      }
    }
    init()
  }, [])

  return (
    <SettingType id={id} icon={icon} title={t('settings.ocr.title')}>
      <SettingRow>
        <FormItem title={t('settings.ocr.languagePacks')}>
          <Input value={tesseractList} onChange={changeHandler} />
        </FormItem>
      </SettingRow>
      <SettingRow>
        <span>
          <OpenBroswer title={t('settings.ocr.checkModels')} url="https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016" />
          {t('settings.ocr.modelInstruction')}
        </span>
      </SettingRow>
    </SettingType>
  )
}