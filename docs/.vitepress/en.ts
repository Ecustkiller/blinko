import { defineConfig, type DefaultTheme } from 'vitepress'

const links = [
  { text: 'guide', link: '/en/guide' },
  { text: 'download', link: '/en/download' },
]
export const en = defineConfig({
  lang: 'en',
  // 一个跨平台笔记应用
  description: 'A cross-platform application',

  themeConfig: {
    nav: nav(),

    sidebar: links,

    footer: {
      copyright: `Copyright © 2024-${new Date().getFullYear()} codexu`
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return links
}

