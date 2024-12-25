import useArticleStore from "@/stores/article";
import wordsCount from 'words-count';

export default function ConvertHTML() {
  const { currentArticle } = useArticleStore()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs">{wordsCount(currentArticle)} 字</span>
    </div>
  )
}