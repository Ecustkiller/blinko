'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FileSidebar } from "./file"
import { MdEditor } from './md-editor'
import dynamic from 'next/dynamic'

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
  const onLayout = (sizes: number[]) => {
    localStorage.setItem("react-resizable-panels:layout", JSON.stringify(sizes));
  };
 
  return (
    <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
      <ResizablePanel defaultSize={defaultLayout[0]} className="max-w-[420px] min-w-[240px]">
        <FileSidebar />
      </ResizablePanel>
      <ResizableHandle />
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