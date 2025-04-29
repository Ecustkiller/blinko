import { defineConfig } from 'vitepress'
import { en } from './en'
import { zh } from './zh'
import { ja } from './ja'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "note-gen",
  description: "A cross-platform Markdown note-taking application dedicated to using AI to bridge recording and writing, organizing fragmented knowledge into a readable note.",
  locales: {
    root: {
      label: '中文',
      link: '/zh',
      ...zh,
    },
    en: {
      label: 'English',
      lang: 'en',
      ...en
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      ...ja
    }
  },
  vite: {
    css: {
      postcss: {
        plugins: {
          }
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    i18nRouting: true,
    logo: { src: '/assets/app-icon.png', width: 24, height: 24 },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hahaxiaowai/note-gen' }
    ]
  }
})
