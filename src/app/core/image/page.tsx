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
  const { githubUsername, accessToken, repositoryName, } = useSettingStore()
  const { fetchAllMarks } = useMarkStore()

  useEffect(() => {
    if (checkSetting) {
      getImages()
      fetchAllMarks()
    }
  }, [checkSetting])

  useEffect(() => {
    if (githubUsername && accessToken && repositoryName) {
      setCheckSetting(true)
    }
  }, [githubUsername, accessToken, repositoryName])
  
  return (
    <div className="h-screen overflow-auto">
      <ImageHeader />
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
  )
}