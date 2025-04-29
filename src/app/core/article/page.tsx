'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FileSidebar } from "./file"
import { MdEditor } from './md-editor'
import dynamic from 'next/dynamic'
import { useSidebarStore } from "@/stores/sidebar"
import useArticleStore from "@/stores/article"
import { useEffect } from 'react'

function getDefaultLayout() {
  const layout = localStorage.getItem("react-resizable-panels:layout");
  if (layout) {
    return JSON.parse(layout);
  }
  return [25, 75]
}

function ResizebleWrapper({
  defaultLayout,
}: {
  defaultLayout: number[];
}) {
  const { fileSidebarVisible } = useSidebarStore()
  const { activeFilePath, readArticle } = useArticleStore()
  const onLayout = (sizes: number[]) => {
    localStorage.setItem("react-resizable-panels:layout", JSON.stringify(sizes));
  };

  // 在组件挂载后和activeFilePath变化时，确保重新读取当前文件
  useEffect(() => {
    // 检查localStorage中是否有待读取的文件
    const pendingReadArticle = localStorage.getItem('pendingReadArticle')
    if (pendingReadArticle) {
      // 如果有，读取它并清除localStorage中的记录
      readArticle(pendingReadArticle)
      localStorage.removeItem('pendingReadArticle')
      return
    }
    
    // 正常处理activeFilePath的情况
    if (activeFilePath) {
      // 延迟一些时间再读取，确保状态已更新
      const timer = setTimeout(() => {
        readArticle(activeFilePath)
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [activeFilePath, readArticle])

  return (
    <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
      <ResizablePanel defaultSize={defaultLayout[0]} className={`${fileSidebarVisible ? 'max-w-[420px] min-w-[240px]' : '!flex-[0]'}`}>
        <FileSidebar />
      </ResizablePanel>
      <ResizableHandle className={fileSidebarVisible ? 'w-[1px]' : 'w-[0]'} />
      <ResizablePanel defaultSize={defaultLayout[1]}>
        <MdEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function Page() {
  const defaultLayout = getDefaultLayout();
  return <ResizebleWrapper defaultLayout={defaultLayout} />
}

export default dynamic(() => Promise.resolve(Page), { ssr: false })