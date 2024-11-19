import { LocalImage } from "@/components/local-image"
function Page() {
  return (
    <div className="flex h-screen">
      <LocalImage className="w-screen h-screen" src="/temp_screenshot.png" alt="" />
    </div>
  )
}

Page.getLayout = () => <div className="bg-green-500"></div>

export default Page