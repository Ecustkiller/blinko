'use client'
import { GithubFile } from '@/lib/github'
import { useEffect } from 'react'
import { ImageCard } from './image-card'
import useImageStore from '@/stores/image'
import useMarkStore from '@/stores/mark'
import { ImageHeader } from './image-header'
 
export default function Page() {
  const { images, getImages } = useImageStore()
  const { fetchAllMarks } = useMarkStore()
  useEffect(() => {
    getImages()
    fetchAllMarks()
  }, [])
  
  return (
    <div className="h-screen overflow-auto">
      <ImageHeader />
      <div className="p-2 grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
        {
          images.map((file: GithubFile) => (
            <ImageCard key={file.path} file={file} />
          ))
        }
      </div>
    </div>
  )
}