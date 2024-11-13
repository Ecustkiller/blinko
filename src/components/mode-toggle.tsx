"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SidebarMenuButton } from "./ui/sidebar"

function Toggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  )
}

export function ModeToggle() {
  return (
    <SidebarMenuButton asChild className="md:h-8 md:p-0"
      tooltip={{
        children: '主题',
        hidden: false,
      }}
    >
      <a href="#">
        <div className="flex size-8 items-center justify-center rounded-lg">
          <Toggle />
        </div>
      </a>
    </SidebarMenuButton>
  )
}
