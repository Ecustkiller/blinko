import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HistoryIcon, LoaderCircle } from "lucide-react";
import { ExposeParam } from "md-editor-rt";
import { RefObject, useState } from "react";
import { Button } from "@/components/ui/button";
import { decodeBase64ToString, getFileCommits, getFiles } from "@/lib/github";
import useArticleStore from "@/stores/article";
import { ResCommit } from "@/lib/github.types";
import dayjs from "dayjs";

export default function History({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { activeFilePath, setCurrentArticle, currentArticle } = useArticleStore()
  const [commits, setCommits] = useState<ResCommit[]>([])
  const [loading, setLoading] = useState(false)
  const [commitsLoading, setCommitsLoading] = useState(false)

  async function onOpenChange() {
    setCommitsLoading(true)
    setCommits([])
    mdRef.current?.focus()
    const res = await getFileCommits({ path: `article/${activeFilePath}` })
    setCommits(res)
    setCommitsLoading(false)
  }

  async function handleCommit(sha: string) {
    setLoading(true)
    const cacheArticle = currentArticle;
    setCurrentArticle('正在读取历史记录...')
    const res = await getFiles({path: `article/${activeFilePath}?ref=${sha}`})
    if (res.content) {
      setCurrentArticle(decodeBase64ToString(res.content))
    } else {
      setCurrentArticle(cacheArticle)
    }
    setLoading(false)
  }
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild className="outline-none">
        <Button variant="ghost" size="icon" title="翻译">
          {
            loading ? <LoaderCircle className="animate-spin size-4" /> : <HistoryIcon />
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>历史记录</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          commitsLoading ? 
          <DropdownMenuItem><LoaderCircle className="animate-spin size-4" />正在获取历史记录...</DropdownMenuItem> :
            <DropdownMenuGroup>
              {
                commits.length ?
                  commits.map(commit => (
                    <DropdownMenuItem key={commit.sha} onClick={() => handleCommit(commit.sha)}>
                      {dayjs(commit.commit.committer.date).format('YYYY-MM-DD HH:mm:ss')} - {commit.commit.message}
                    </DropdownMenuItem>
                  )) :
                  <DropdownMenuItem>暂无历史记录</DropdownMenuItem>
              }
            </DropdownMenuGroup>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}