import { TooltipButton } from "@/components/tooltip-button";
import { Bold, BotMessageSquare, Code, Columns2, ImagePlus, Italic, Link, Strikethrough, Table, Underline, WrapText } from "lucide-react";
import { ExposeParam, NormalToolbar, ToolbarNames } from "md-editor-rt";
import { ReactNode, RefObject } from "react";

const toolbarsConfig = [
  {
    title: 'AI',
    icon: <BotMessageSquare />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.focus()
    },
  },
  '-',
  {
    title: '加粗',
    icon: <Bold />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('bold')
    },
  },
  {
    title: '下划线',
    icon: <Underline />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('underline')
    },
  },
  {
    title: '斜体',
    icon: <Italic />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('italic')
    },
  },
  {
    title: '删除线',
    icon: <Strikethrough />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('strikeThrough')
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
  '-',
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
    title: '格式化',
    icon: <WrapText />,
    onClick: (mdRef: RefObject<ExposeParam>) => {
      mdRef.current?.execCommand('prettier')
    },
  },
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
      title="mark"
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