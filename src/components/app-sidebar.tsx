'use client'

import { Star, ImageUp, Search, Recycle, History, Network, ScanFace, Settings, Highlighter, SquarePen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import { ModeToggle } from "./mode-toggle"
 
// Menu items.
const items = [
  {
    title: "记录",
    url: "/core/note",
    icon: Highlighter,
    isActive: true,
  },
  {
    title: "写作",
    url: "/core/article",
    icon: SquarePen,
  },
  {
    title: "收藏",
    url: "#",
    icon: Star,
  },
  {
    title: "图床",
    url: "/core/image",
    icon: ImageUp,
  },
  {
    title: "搜索",
    url: "#",
    icon: Search,
  },
  {
    title: "回收站",
    url: "#",
    icon: Recycle,
  },
  {
    title: "历史",
    url: "#",
    icon: History,
  },
  {
    title: "平台",
    url: "#",
    icon: Network,
  },
]
 
export function AppSidebar() {
  // 获取当前的路由
  const pathname = usePathname()

  return (
    <Sidebar 
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r h-screen"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ScanFace className="size-5" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <SidebarMenuButton asChild className="md:h-8 md:p-0"
          tooltip={{
            children: '设置',
            hidden: false,
          }}
        >
          <a href="/core/setting">
            <div className="flex size-8 items-center justify-center rounded-lg">
              <Settings className="size-4" />
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}