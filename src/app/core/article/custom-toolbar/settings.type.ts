import { ToolbarNames } from "md-editor-rt"
import { Dispatch, SetStateAction } from "react"

export interface Settings {
  toolbar: ToolbarNames[]
  setToolbar: Dispatch<SetStateAction<ToolbarNames[]>>
}
