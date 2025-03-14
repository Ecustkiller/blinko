import useSettingStore, { GenTemplate, GenTemplateRange } from "@/stores/setting";
import { SettingRow, SettingType } from "../components/setting-base";
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { confirm } from '@tauri-apps/plugin-dialog';

export function SettingTemplate({id, icon}: {id: string, icon?: React.ReactNode}) {
  const t = useTranslations();
  const { templateList, setTemplateList } = useSettingStore()

  function changeHandler(current: GenTemplate, key: keyof GenTemplate, value: any) {
    setTemplateList(templateList.map(item => {
      if (item.id === current.id) {
        return {...item, [key]: value}
      }
      return item
    }))
  }

  function createTemplateHandler() {
    setTemplateList([...templateList, {
      id: `${templateList.length + 1}`,
      status: true,
      title: t('settings.template.customTemplate'),
      content: '',
      range: GenTemplateRange.All,
    }])
  }

  function deleteTemplateHandler(id: string) {
    confirm(t('settings.template.deleteConfirm')).then(async (res) => {
      if (res) {
        setTemplateList(templateList.filter(item => item.id !== id))
      }
    })
  }

  useEffect(() => {
  }, [templateList])

  return (
    <SettingType id={id} icon={icon} title={t('settings.template.title')}>
      <SettingRow>
        <Table>
          <TableCaption>
            <Button onClick={createTemplateHandler} variant={"link"}>{t('settings.template.addTemplate')}</Button>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">{t('settings.template.status')}</TableHead>
              <TableHead className="w-[100px] pl-3">{t('settings.template.name')}</TableHead>
              <TableHead className="pl-3">{t('settings.template.content')}</TableHead>
              <TableHead className="w-[120px]">{t('settings.template.scope')}</TableHead>
              <TableHead className="text-center w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              templateList.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Switch
                        className="transform scale-75 translate-y-0.5"
                        disabled={item.id === '0'}
                        checked={item.status}
                        onCheckedChange={(checked) => changeHandler(item, 'status', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="setting-input"
                        defaultValue={item.title}
                        onBlur={(e) => changeHandler(item, 'title', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        rows={3}
                        className="setting-input"
                        defaultValue={item.content}
                        onBlur={(e) => changeHandler(item, 'content', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                    <Select onValueChange={(value) => changeHandler(item, 'range', value)} defaultValue={item.range}>
                      <SelectTrigger className="w-[120px] setting-select">
                        <SelectValue placeholder={t('settings.template.selectScope')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            Object.values(GenTemplateRange).map((value) => {
                              return <SelectItem key={value} value={value}>{value}</SelectItem>
                            })
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        disabled={item.id === '0'}
                        variant={"ghost"}
                        size={"icon"}
                        className="text-red-500"
                        onClick={() => deleteTemplateHandler(item.id)}
                      ><XIcon /></Button>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </SettingRow>
    </SettingType>
  )
}