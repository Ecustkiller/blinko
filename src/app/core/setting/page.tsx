'use client'
import { redirect } from 'next/navigation'
import baseConfig from "./config"

export default function Page() {
  // 重定向到第一个设置项页面
  redirect(`/core/setting/${baseConfig[0].anchor}`)
}