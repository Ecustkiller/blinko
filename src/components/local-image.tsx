'use client'
import Image from "next/image"
import { appDataDir } from '@tauri-apps/api/path';
import { convertFileSrc } from "@tauri-apps/api/core";
import React, { useState } from "react";

export function LocalImage({ src, ...props }: React.ComponentProps<typeof Image>) {
  const [localSrc, setLocalSrc] = useState<string>('')

  async function getAppDataDir() {
    const appDataDirPath = await appDataDir()
    const imagePath = appDataDirPath + src
    const covertFileSrcPath = convertFileSrc(imagePath)
    setLocalSrc(covertFileSrcPath)
  }

  React.useEffect(() => {
    getAppDataDir()
  })

  // 如果 loaclSrc 存在
  return (
    localSrc ?
    <Image src={localSrc} alt="" width={0} height={0} className={props.className} style={props.style} /> :
    null
  )
}
