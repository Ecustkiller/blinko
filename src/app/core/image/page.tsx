'use client'
import { GithubFile } from '@/lib/github'
import { useEffect, useState } from 'react'
import { ImageCard } from './image-card'
import useImageStore from '@/stores/image'
import useMarkStore from '@/stores/mark'
import { ImageHeader } from './image-header'
import useSettingStore from '@/stores/setting'
import { NoData } from './no-data'
 
export default function Page() {
  const [checkSetting, setCheckSetting] = useState(false)

  const { images, getImages } = useImageStore()
  const { githubUsername, accessToken } = useSettingStore()
  const { fetchAllMarks } = useMarkStore()

  useEffect(() => {
    if (checkSetting && images.length === 0) {
      getImages()
      fetchAllMarks()
    }
  }, [checkSetting])

  useEffect(() => {
    if (githubUsername && accessToken) {
      setCheckSetting(true)
    }
  }, [githubUsername, accessToken])
  
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <ImageHeader />
      <div className="flex-1 overflow-y-auto">
        {
          checkSetting ? 
          (
            <div className="p-2 grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {
                images.map((file: GithubFile) => (
                  <ImageCard key={file.path} file={file} />
                )) 
              }
            </div>
          ): 
          <NoData />
        }
      </div>
    </div>
  )
}