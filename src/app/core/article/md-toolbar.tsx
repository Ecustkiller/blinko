import { TooltipButton } from "@/components/tooltip-button";
import { BotMessageSquare, Code, Columns2, ImagePlus, Link, ListRestart, Sparkles, Table } from "lucide-react";
import { ExposeParam, NormalToolbar, ToolbarNames } from "md-editor-rt";
import { ReactNode, RefObject } from "react";
import { fetchAiStream } from '@/lib/ai'

const toolbarsConfig = [
  {
    title: 'AI',
    icon: <BotMessageSquare />,
    onClick: async (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.focus()
      const selectedText = mdRef.current?.getSelectedText()
      const req = `根据需求：${selectedText}，如果是问题回答问题，如果不是，则根据内容生成文章，直接返回结果。`
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
    title: '格式化',
    icon: <ListRestart />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('prettier')
    },
  },
  '-',
  {
    title: '链接',
    icon: <Link />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('link')
    },
  },
  {
    title: '图片',
    icon: <ImagePlus />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('image')
    },
  },
  {
    title: '表格',
    icon: <Table />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('table')
    },
  },
  {
    title: '代码',
    icon: <Code />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('code')
    },
  },
  '=',
  {
    title: '预览',
    icon: <Columns2 />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.togglePreview()
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
  { title: string, icon: ReactNode, onClick: (mdRef: RefObject<ExposeParam>) => void, mdRef: RefObject<ExposeParam>}
) => {
  return (
    <NormalToolbar
      trigger={
        <TooltipButton icon={icon} tooltipText={title} />
      }
      onClick={() => onClick(mdRef)}
      key={title}
    />
  );
};

export const defToolbars = (mdRef: RefObject<ExposeParam>) => {
  return toolbarsConfig.filter(item => typeof item !== 'string').map((item) => 
    <Toolbar
      mdRef={mdRef}
      key={item.title}
      icon={item.icon}
      title={item.title}
      onClick={item.onClick}
    />
  )
}