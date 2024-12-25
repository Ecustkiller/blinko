import { ExposeParam } from "md-editor-rt";
import { RefObject, useEffect } from "react";
import { Label } from "@/components/ui/label";
import useArticleStore from "@/stores/article";
import { Checkbox } from "@/components/ui/checkbox";

export default function ConvertHTML({mdRef}: {mdRef: RefObject<ExposeParam>}) {
  const { html2md, setHtml2md, initHtml2md } = useArticleStore()

  async function switchChangeHandler(isChecked: boolean) {
    mdRef.current?.focus()
    setHtml2md(isChecked)
  }

  useEffect(() => {
    initHtml2md()
  }, [])

  return (
    <div className="flex items-center space-x-1">
      <Checkbox id="HTML2MD" className="scale-[80%]" checked={html2md} onCheckedChange={switchChangeHandler} />
      <Label htmlFor="HTML2MD" className="text-xs cursor-pointer">HTML2MD</Label>
    </div>
  )
}