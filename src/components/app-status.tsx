import { SidebarMenuButton } from "./ui/sidebar";
import { createSyncRepo, getUserInfo } from "@/lib/github";
import { useEffect, useState } from "react";
import useSettingStore from "@/stores/setting";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleUserRound } from "lucide-react";

export default function AppStatus() {
  const { accessToken, setGithubUsername } = useSettingStore()
  const [avatar, setAvatar] = useState('')

  async function handleGetUserInfo() {
    const res = await getUserInfo()
    if (res) {
      setAvatar(res.data.avatar_url)
      setGithubUsername(res.data.login)
    } else {
      setAvatar('')
    }
    await createSyncRepo()
  }

  useEffect(() => {
    handleGetUserInfo()
  }, [accessToken])

  return <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback><CircleUserRound /></AvatarFallback>
    </Avatar>
  </SidebarMenuButton>
}