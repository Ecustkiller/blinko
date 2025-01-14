import { BotMessageSquare, Command, FileUp, Palette, ScanText, Store } from "lucide-react"
import { OpenBroswer } from "./open-broswer"
import { toast } from "@/hooks/use-toast"
import { z } from "zod";

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
        desc: '',
        type: 'button',
        schema: z.string(),
        disabled: true,
        layout: 'horizontal',
        onClick: async () => {
          toast({ title: '当前版本' })
        }
      },
      // {
      //   title: '自动更新',
      //   key: 'autoUpdate',
      //   value: true,
      //   desc: <>关闭后，NoteGen 将不会自动更新。</>,
      //   schema: z.boolean(),
      //   disabled: true,
      //   layout: 'horizontal',
      //   type: 'switch',
      // },
      // {
      //   title: '语言',
      //   key: 'language',
      //   value: '简体中文',
      //   desc: <>更改界面语言</>,
      //   type: 'select',
      //   schema: z.string(),
      //   disabled: true,
      //   layout: 'horizontal',
      // }
    ]
  },
  {
    title: 'AI',
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
        title: '模型选择',
        key: 'model',
        value: 'gpt-4o-mini',
        desc: <>
          <span>选择 ChatGPT 模型，不同的模型对应不同的资费标准，请按实力选择。</span><br />
          <OpenBroswer title="费用标准参考" url="https://chatanywhere.apifox.cn/doc-2694962" />
        </>,
        schema: z.string(),
        disabled: false,
        layout: 'horizontal',
        type: 'select',
      },
    ],
  },
  {
    title: '同步',
    icon: <FileUp />,
    anchor: 'sync',
    settings: [
      {
        title: '访问令牌',
        key: 'accessToken',
        value: '',
        desc: <>Github 访问令牌，NoteGen 通过此令牌来访问你的存储仓库。</>,
        schema: z.string(),
        disabled: false,
        layout: 'vertical',
        type: 'input',
      },
      {
        title: 'jsDelivr 加速',
        key: 'jsdelivr',
        value: true,
        desc: <>开启后，将使用 jsDelivr 加速图床，图片链接将替换为 jsDelivr 的链接，否则将使用 raw.githubusercontent.com。</>,
        schema: z.boolean(),
        disabled: false,
        layout: 'horizontal',
        type: 'switch',
      },
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
        value: 'eng,chi_sim',
        desc: <>
          <OpenBroswer title="在此查询全部模型" url="https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016" />，以逗号分隔，例如：eng,chi_sim。
        </>,
        schema: z.string(),
        disabled: false,
        layout: 'vertical',
        type: 'input',
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
        value: 'CommandOrControl+Shift+S',
        desc: <>截图是快速记录的最佳方式，可以通过全局快捷键快速截图，无需打开主页面。</>,
        schema: z.string(),
        disabled: true,
        layout: 'horizontal',
        type: 'shortcut',
      }
    ],
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
]