import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import useArticleStore, { DirTree } from "@/stores/article";
import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";
import { File } from "lucide-react"

export function FileItem({ item }: { item: DirTree }) {
  const { activeFilePath, setActiveFilePath, readArticle, loadFileTree, setCurrentArticle } = useArticleStore()
  const path = item.parent?.name ? item.parent.name + '/' + item.name : item.name

  function handleSelectFile() {
    setActiveFilePath(path)
    readArticle(path)
  }

  async function handleDeleteFile() {
    await remove(`article/${path}`, { baseDir: BaseDirectory.AppData })
    await loadFileTree()
    setActiveFilePath('')
    setCurrentArticle('')
  }
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuButton isActive={activeFilePath === path} onClick={handleSelectFile}>
          <File />
          <span>{item.name}</span>
        </SidebarMenuButton>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset>
          查看原文件
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          剪切
        </ContextMenuItem>
        <ContextMenuItem inset>
          复制
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          粘贴
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          重命名
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-900" onClick={handleDeleteFile}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}