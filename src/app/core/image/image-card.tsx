import { CircleX, Lock } from "lucide-react"
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { GithubFile } from "@/lib/github"
import { Button } from "@/components/ui/button"
import { convertBytesToSize } from '@/lib/utils'
import { deleteFile } from "@/lib/github"
import { toast } from "@/hooks/use-toast"
import useImageStore from "@/stores/image"
import useMarkStore from "@/stores/mark"

export function ImageCard({file}: {file: GithubFile}) {
  const { getImages } = useImageStore()
  const { allMarks } = useMarkStore()
  async function handleDelete(file: GithubFile) {
    const res = await deleteFile(file)
    if (res) {
      toast({ title: '文件已删除', description: file.name })
    } else {
      toast({ title: '文件已删除', description: '图床数据同步有延迟' })
    }
    getImages()
  }
  return (
    <Card className={`w-full h-36 overflow-hidden p-0 rounded-lg shadow-none relative group hover:outline outline-2`}>
      <CardHeader className="p-0 relative">
        <Image src={file.download_url} alt={file.name} width={0} height={0} className="w-full h-36 object-cover" />
        <div className="absolute top-0 right-0 !mt-0 z-10">
          {allMarks.map(item => item.url).includes(file.download_url) ?
            <Button size="icon" disabled><Lock /></Button>: 
            <Button size="icon" onClick={() => handleDelete(file)}><CircleX /></Button>
          }
        </div>
      </CardHeader>
      <CardContent className="p-2 gap-1 absolute bottom-0 hidden flex-col bg-secondary-foreground group-hover:flex">
        <CardDescription className="flex text-xs">
          名称: {file.name}
        </CardDescription>
        <CardDescription className="flex text-xs">
          大小: {convertBytesToSize(file.size)}
        </CardDescription>
      </CardContent>
    </Card>
  )
}