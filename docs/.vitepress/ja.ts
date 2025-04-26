import { defineConfig, type DefaultTheme } from 'vitepress'

const links = [
  { text: 'ガイド', link: '/ja/guide' },
  { text: 'ダウンロード', link: '/ja/download' },
]
export const ja = defineConfig({
  lang: 'ja',
  description: 'クロスプラットフォーム対応のノートアプリ',

  themeConfig: {
    nav: nav(),

    sidebar: links,
    footer: {
      copyright: `著作権 © 2024-${new Date().getFullYear()} codexu`
    },

    docFooter: {
      prev: '前のページ',
      next: '次のページ'
    },

    outline: {
      label: 'ページナビゲーション'
    },

    lastUpdated: {
      text: '最終更新日',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '言語選択',
    returnToTopLabel: 'トップに戻る',
    sidebarMenuLabel: 'メニュー',
    darkModeSwitchLabel: 'テーマ',
    lightModeSwitchTitle: 'ライトモードに切り替え',
    darkModeSwitchTitle: 'ダークモードに切り替え'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return links
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  ja: {
    placeholder: 'ドキュメントを検索',
    translations: {
      button: {
        buttonText: 'ドキュメントを検索',
        buttonAriaLabel: 'ドキュメントを検索'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '検索条件をクリア',
          resetButtonAriaLabel: '検索条件をクリア',
          cancelButtonText: 'キャンセル',
          cancelButtonAriaLabel: 'キャンセル'
        },
        startScreen: {
          recentSearchesTitle: '検索履歴',
          noRecentSearchesText: '検索履歴がありません',
          saveRecentSearchButtonTitle: '検索履歴に保存',
          removeRecentSearchButtonTitle: '検索履歴から削除',
          favoriteSearchesTitle: 'お気に入り',
          removeFavoriteSearchButtonTitle: 'お気に入りから削除'
        },
        errorScreen: {
          titleText: '結果を取得できません',
          helpText: 'ネットワーク接続を確認してください'
        },
        footer: {
          selectText: '選択',
          navigateText: 'ナビゲート',
          closeText: '閉じる',
          searchByText: '検索提供者'
        },
        noResultsScreen: {
          noResultsText: '関連する結果が見つかりません',
          suggestedQueryText: '別のクエリを試してください',
          reportMissingResultsText: 'このクエリに結果があるべきだと思いますか？',
          reportMissingResultsLinkText: 'フィードバックを送信'
        }
      }
    }
  }
}
