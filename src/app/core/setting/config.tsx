import { BotMessageSquare, Command, FileUp, Palette, ScanText, Store, TriangleAlert } from "lucide-react"
import { OpenBroswer } from "./open-broswer"
import { toast } from "@/hooks/use-toast"
import { z } from "zod";
import { Version } from "./version";

export const config = [
  {
    title: '关于',
    icon: <Store />,
    anchor: 'about',
    settings: [
      {
        title: `版本`,
        key: 'version',
        value: '检查更新',
        desc: <>
          当前版本: <Version />，<OpenBroswer title="查询历史版本" url="https://github.com/codexu/note-gen/releases" />。
        </>,
        type: 'button',
        schema: z.string(),
        disabled: true,
        layout: 'horizontal',
        onClick: async () => {
          toast({ title: '当前版本' })
        }
      },
      {
        title: '自动更新',
        key: 'autoUpdate',
        value: true,
        desc: <>关闭后，NoteGen 将不会自动更新。</>,
        schema: z.boolean(),
        disabled: true,
        layout: 'horizontal',
        type: 'switch',
      },
      {
        title: '语言',
        key: 'language',
        value: '简体中文',
        desc: <>更改界面语言</>,
        type: 'select',
        schema: z.string(),
        disabled: true,
        layout: 'horizontal',
      }
    ]
  },
  {
    title: '外观',
    icon: <Palette />,
    anchor: 'style',
    settings: [
      {
        title: '预览内容主题',
        key: 'previewTheme',
        value: 'github',
        desc: <>在笔记生成和文章编辑预览时，更改预览内容主题。</>,
        type: 'select',
        schema: z.string(),
        disabled: false,
        layout: 'horizontal',
      },
      {
        title: '代码高亮主题',
        key: 'codeTheme',
        value: 'github',
        desc: <>代码块高亮样式。</>,
        type: 'select',
        schema: z.string(),
        disabled: false,
        layout: 'horizontal',
      },
    ],
  },
  {
    title: 'ChatGPT',
    icon: <BotMessageSquare />,
    anchor: 'ai',
    settings: [
      {
        title: 'API Key',
        key: 'apiKey',
        value: '',
        desc: <>
          你需要使用你的 Github 账号绑定来领取你自己的免费Key。<br />
          <OpenBroswer title="申请领取内测免费API Key" url="https://api.chatanywhere.org/v1/oauth/free/render" />或
          <OpenBroswer title="购买内测付费API Key" url="https://buyca.tech/" />
        </>,
        schema: z.string(),
        disabled: false,
        layout: 'vertical',
        type: 'input',
      },
      {
        title: '记录 AI 生成描述',
        key: 'markDescGen',
        value: true,
        desc: <>
          <span>截图和插图记录时，生成 AI 描述，而不是展示 OCR 识别的文本，可以更加直观的了解记录的核心内容。</span><br />
          <span className="flex items-center gap-1 mt-2 text-red-900">
            <TriangleAlert className="size-4" />开启此项将降低记录生成的速度，并且消耗更多的 API 请求次数，建议免费用户关闭。
          </span>
        </>,
        schema: z.boolean(),
        disabled: true,
        layout: 'horizontal',
        type: 'switch',
      }
    ],
  },
  {
    title: 'OCR',
    icon: <ScanText />,
    anchor: 'ocr',
    settings: [
      {
        title: '识别语言包',
        key: 'tesseractList',
        value: true,
        desc: <>
          选择你需要的语言包，并下载。
          <OpenBroswer title="在此查询全部模型" url="https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016" />。
        </>,
        schema: z.boolean(),
        disabled: true,
        layout: 'horizontal',
        type: 'switch',
      }
    ],
  },
  {
    title: '快捷键',
    icon: <Command />,
    anchor: 'shortcut',
    settings: [
      {
        title: '截图',
        key: 'screenshotShortcut',
        value: 'Command+Shift+R',
        desc: <>截图是快速记录的最佳方式，可以通过全局快捷键快速截图，无需打开主页面。</>,
        schema: z.string(),
        disabled: true,
        layout: 'horizontal',
        type: 'shortcut',
      }
    ],
  },
  {
    title: '同步',
    icon: <FileUp />,
    anchor: 'file',
    settings: [
      {
        title: '开启同步',
        key: 'sync',
        value: false,
        desc: <>开启同步后，您的数据将同步到 Github，但需要你配置 Github Token，并创建存储仓库。</>,
        schema: z.boolean(),
        disabled: true,
        layout: 'horizontal',
        type: 'switch',
      }
    ],
  },
]