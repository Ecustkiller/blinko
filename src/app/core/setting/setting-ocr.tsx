import { Input } from "@/components/ui/input";
import { FormItem, SettingRow, SettingType } from "./setting-base";
import { useEffect } from "react";
import useSettingStore from "@/stores/setting";
import { Store } from "@tauri-apps/plugin-store";
import { OpenBroswer } from "./open-broswer";

export function SettingOCR() {
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
    <SettingType title="OCR">
      <SettingRow>
        <FormItem title="语言包">
          <Input value={tesseractList} onChange={changeHandler} />
        </FormItem>
      </SettingRow>
      <SettingRow>
        <span>
          <OpenBroswer title="在此查询全部模型" url="https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016" />
          ，以逗号分隔，例如：eng,chi_sim。
        </span>
      </SettingRow>
    </SettingType>
  )
}