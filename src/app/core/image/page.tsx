'use client'
import { Button } from '@/components/ui/button'
import useSettingStore from '@/stores/setting'
import { Octokit } from '@octokit/core'

export default function Page() {

  const { accessToken } = useSettingStore()

  const octokit = new Octokit({
    auth: accessToken
  })
  
  async function uploadImage() {
    const res = await octokit.request('PUT /repos/codexu/note-gen-sync/contents/images/your_image1.png', {
      message: 'a new commit message',
      content: 'bXkgdXBkYXRlZCBmaWxlIGNvbnRlbnRz',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    console.log(res);
  }
  
  return (
    <div className="flex h-screen">
      <Button onClick={uploadImage}>上传</Button>
    </div>
  )
}