import useArticleStore from "@/stores/article";
import wordsCount from 'words-count';

export default function ConvertHTML() {
  const { currentArticle } = useArticleStore()

  return (
    <div className="flex items-center gap-1">
      <span className="h-3.5">{wordsCount(currentArticle)} 字</span>
    </div>
  )
}