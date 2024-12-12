import { TooltipButton } from "@/components/tooltip-button";
import { BotMessageSquare, CloudUpload, Code, Columns2, Globe, HardDriveUpload, History, ImagePlus, Link, ListRestart, Sparkles, Table, View } from "lucide-react";
import { DropdownToolbar, ExposeParam, NormalToolbar, ToolbarNames } from "md-editor-rt";
import { ReactNode, RefObject, useState } from "react";
import { fetchAiStream } from '@/lib/ai'
import useArticleStore from "@/stores/article";
import { locales } from "@/lib/locales";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { decodeBase64ToString, getFileCommits, getFiles, uint8ArrayToBase64, uploadFile } from "@/lib/github";
import { toast } from "@/hooks/use-toast";

const toolbarsConfig = [
  {
    title: 'AI',
    type: 'button',
    icon: <BotMessageSquare />,
    onClick: async (mdRef: RefObject<ExposeParam>, currentArticle?: string) => {
      mdRef.current?.focus()
      const selectedText = mdRef.current?.getSelectedText()
      const req = `
        参考原文：${currentArticle}
        根据需求：${selectedText}，如果是问题回答问题，如果不是，则根据内容生成文章，直接返回结果。
      `
      let res = ''
      await fetchAiStream(req, text => {
        if (text === '[DONE]') return
        mdRef.current?.insert(() => ({
          targetValue: res += text,
        }))
        mdRef.current?.rerender();
      })
    },
  },
  {
    title: '优化',
    type: 'button',
    icon: <Sparkles />,
    onClick: async (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.focus()
      const selectedText = mdRef.current?.getSelectedText()
      const req = `完善这段文字：${selectedText}，注意这不是提问，直接返回优化后的结果。`
      let res = ''
      await fetchAiStream(req, text => {
        if (text === '[DONE]') return
        mdRef.current?.insert(() => ({
          targetValue: res += text,
        }))
        mdRef.current?.rerender();
      })
    },
  },
  {
    title: 'translation',
    type: 'select',
    icon: <Globe />,
    list: locales,
    onClick: async (mdRef: RefObject<ExposeParam>, locale: string) => {
      mdRef.current?.focus()
      const selectedText = mdRef.current?.getSelectedText()
      const req = `将这段文字：${selectedText}，翻译为${locale}语言，直接返回翻译后的结果。`
      let res = ''
      await fetchAiStream(req, text => {
        if (text === '[DONE]') return
        mdRef.current?.insert(() => ({
          targetValue: res += text,
        }))
        mdRef.current?.rerender();
      })
    },
  },
  {
    title: '格式化',
    type: 'button',
    icon: <ListRestart />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('prettier')
    },
  },
  '-',
  {
    title: '链接',
    type: 'button',
    icon: <Link />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('link')
    },
  },
  {
    title: '图片',
    type: 'button',
    icon: <ImagePlus />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('image')
    },
  },
  {
    title: '表格',
    type: 'button',
    icon: <Table />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('table')
    },
  },
  {
    title: '代码',
    type: 'button',
    icon: <Code />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('code')
    },
  },
  '=',
  {
    title: '预览',
    type: 'button',
    icon: <Columns2 />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.togglePreview()
    },
  },
  {
    title: '仅预览',
    type: 'button',
    icon: <View />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.togglePreviewOnly()
    },
  },
  '-',
  {
    title: '导出',
    type: 'button',
    icon: <HardDriveUpload />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.togglePreviewOnly()
    },
  },
  {
    title: '历史',
    type: 'button',
    icon: <History />,
    onClick: async(mdRef: RefObject<ExposeParam>, currentArticle?: string, path?: string) => {
      const commits = await getFileCommits({ path: `article/${path}` })
      console.log(commits);
      const res = await getFiles({path: `article/${path}?ref=${commits[0].sha}`})
      console.log(decodeBase64ToString(res.content));
    },
  },
  {
    title: '同步',
    type: 'button',
    icon: <CloudUpload />,
    onClick: async(mdRef: RefObject<ExposeParam>, currentArticle?: string, path?: string) => {
      const res = await getFiles({path: `article/${path}`})
      let sha = undefined
      if (res) {
        sha = res.sha
      }
      toast({title: '开始同步', description: '请稍等...'})
      const filename = path?.split('/').pop()
      const _path = path?.split('/').slice(0, -1).join('/')
      const file = await readFile(`article/${path}`, { baseDir: BaseDirectory.AppData  })
      await uploadFile({ path: `article${_path && '/' + _path}`, ext: 'md', file: uint8ArrayToBase64(file), filename, sha })
    },
  }
]

export const toolbars: ToolbarNames[] = toolbarsConfig.map(item => {
  if (typeof item === 'string') {
    return item as ToolbarNames
  }
  return toolbarsConfig.filter(item => typeof item !== 'string').indexOf(item)
})

const Toolbar = (
  { title, icon, onClick, mdRef }:
  { title: string, icon: ReactNode, onClick: (mdRef: RefObject<ExposeParam>, locale: string, currentArticle?: string) => void, mdRef: RefObject<ExposeParam>}
) => {
  const { currentArticle, activeFilePath } = useArticleStore()
  
  return (
    <NormalToolbar
      trigger={
        <TooltipButton icon={icon} tooltipText={title} />
      }
      onClick={() => onClick(mdRef, currentArticle, activeFilePath)}
      key={title}
    />
  );
};

const SelectToolbar = (
  { title, icon, onClick, mdRef, list }:
  { 
    title: string,
    icon: ReactNode,
    onClick: (mdRef: RefObject<ExposeParam>, item: string,
    currentArticle?: string, ) => void, mdRef: RefObject<ExposeParam>
    list: string[]
  }
) => {
  const [visible, setVisible] = useState(false);
  const { currentArticle } = useArticleStore()

  function handleSelectLocale(locale: string) {
    setVisible(false)
    onClick(mdRef, locale, currentArticle)
  }

  return (
    <DropdownToolbar
      visible={visible}
      onChange={setVisible}
      overlay={
        <div className="p-3 w-48 border rounded -translate-y-1">
          <p className="text-base font-bold mb-2">文本翻译</p>
          <p className="text-xs text-muted-foreground mb-4">请选中需要翻译的文本，并选择需要翻译的语言。</p>
          {
            list.map((locale) => (
              <div className="flex items-center space-x-2 h-6" key={locale} onClick={() => handleSelectLocale(locale)}>
                <span className="cursor-pointer hover:underline text-sm">{locale}</span>
              </div>
            ))
          }
        </div>
      }
      trigger={
        <TooltipButton icon={icon} tooltipText={title} />
      }
      key={title}
    />
  );
};


export const defToolbars = (mdRef: RefObject<ExposeParam>) => {
  return toolbarsConfig.filter(item => typeof item !== 'string').map((item) => 
    item.type === 'select' ? 
    <SelectToolbar
      mdRef={mdRef}
      key={item.title}
      icon={item.icon}
      title={item.title}
      onClick={item.onClick}
      list={item.list as string[]}
    /> :
    <Toolbar
      mdRef={mdRef}
      key={item.title}
      icon={item.icon}
      title={item.title}
      onClick={item.onClick}
    />
  )
}