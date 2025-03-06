import { GitPullRequestArrow, HistoryIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { decodeBase64ToString, getFileCommits, getFiles } from "@/lib/github";
import useArticleStore from "@/stores/article";
import { RepoNames, ResCommit } from "@/lib/github.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipButton } from "@/components/tooltip-button";
import { open } from "@tauri-apps/plugin-shell";
import useSettingStore from "@/stores/setting";
import Vditor from "vditor";
import emitter from "@/lib/emitter";

dayjs.extend(relativeTime)

export default function History({editor}: {editor?: Vditor}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { activeFilePath, setCurrentArticle, currentArticle } = useArticleStore()
  const { accessToken } = useSettingStore()
  const [commits, setCommits] = useState<ResCommit[]>([])
  const [loading, setLoading] = useState(false)
  const [commitsLoading, setCommitsLoading] = useState(false)

  async function onOpenChange(e: boolean) {
    setSheetOpen(e)
    if (!e) return
    setCommitsLoading(true)
    setCommits([])
    editor?.focus()
    const res = await getFileCommits({ path: activeFilePath, repo: RepoNames.sync })
    setCommits(res || [])
    setCommitsLoading(false)
  }

  async function handleCommit(sha: string) {
    setLoading(true)
    setSheetOpen(false)
    const cacheArticle = currentArticle;
    setCurrentArticle('正在读取历史记录...')
    const res = await getFiles({path: `${activeFilePath}?ref=${sha}`, repo: RepoNames.sync})
    if (res.content) {
      setCurrentArticle(decodeBase64ToString(res.content))
    } else {
      setCurrentArticle(cacheArticle)
    }
    setLoading(false)
  }

  function openHandler(url: string) {
    open(url)
  }

  useEffect(() => {
    emitter.on('toolbar-history', () => {
      onOpenChange(true)
    })
  }, [])

  return (
    <Sheet open={sheetOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="历史记录" disabled={!accessToken}>
          {
            loading ? <LoaderCircle className="animate-spin size-4" /> : <HistoryIcon />
          }
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 min-w-[500px]">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>历史记录</SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            {
              commitsLoading ? <LoaderCircle className="size-4 animate-spin" /> : <HistoryIcon className="size-4" />
            }
            {
              commitsLoading ? <span>加载中</span> : <span>{commits.length} 条记录</span>
            }
          </SheetDescription>
        </SheetHeader>
        <div className="max-h-[calc(100vh-90px)] overflow-y-auto">
          {
            commits.map((commit) => (
              <div className="flex justify-between items-center gap-4 border-b px-4 py-2" key={commit.sha}>
                <div className="flex-1 flex flex-col">
                  <span
                    className="text-sm line-clamp-1 hover:underline cursor-pointer"
                    onClick={() => openHandler(commit.html_url)}
                  >{commit.commit.message}</span>
                  <div className="flex gap-1 items-center mt-2">
                    <Avatar className="size-5">
                      <AvatarImage src={commit.author.avatar_url} alt={commit.author.login} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-zinc-500">
                      {commit.author.login} 提交于 {dayjs(commit.commit.committer.date).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="w-8">
                  <TooltipButton icon={<GitPullRequestArrow />} tooltipText="拉取" onClick={() => handleCommit(commit.sha)} />
                </div>
              </div>
            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}