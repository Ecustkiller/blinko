import { BaseDirectory } from '@tauri-apps/plugin-fs'
import useSettingStore from '@/stores/setting'
import { join } from '@tauri-apps/api/path'

/**
 * 获取当前工作区路径
 * 如果设置了自定义工作区，则返回自定义路径
 * 否则返回默认的 AppData/article 路径
 */
export async function getWorkspacePath(): Promise<{ path: string, isCustom: boolean }> {
  const { workspacePath } = useSettingStore.getState()
  
  // 如果设置了自定义工作区路径，则使用自定义路径
  if (workspacePath) {
    return { 
      path: workspacePath,
      isCustom: true 
    }
  }
  
  // 否则使用默认路径
  return { 
    path: 'article', 
    isCustom: false 
  }
}

/**
 * 获取文件的完整路径选项
 * @param relativePath 相对于工作区的路径
 * @returns 包含文件路径和baseDir的选项
 */
export async function getFilePathOptions(relativePath: string): Promise<{ path: string, baseDir?: BaseDirectory }> {
  const workspace = await getWorkspacePath()
  
  if (workspace.isCustom) {
    // 对于自定义工作区，返回绝对路径，不设置baseDir
    const fullPath = await join(workspace.path, relativePath)
    return { path: fullPath }
  } else {
    // 对于默认工作区，使用AppData作为baseDir
    return { 
      path: `article/${relativePath}`, 
      baseDir: BaseDirectory.AppData 
    }
  }
}

/**
 * 将任何路径转换为相对于工作区的路径
 * @param path 原始路径
 * @returns 相对于工作区的路径
 */
export async function toWorkspaceRelativePath(path: string): Promise<string> {
  const workspace = await getWorkspacePath()
  
  // 如果是默认工作区，移除"article/"前缀
  if (!workspace.isCustom && path.startsWith('article/')) {
    return path.replace('article/', '')
  }
  
  // 如果是自定义工作区，移除工作区路径前缀
  if (workspace.isCustom && path.startsWith(workspace.path)) {
    // 确保路径分隔符处理正确
    const relativePath = path.substring(workspace.path.length)
    // 移除开头的斜杠（如果有）
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath
  }
  
  // 如果路径已经是相对路径，直接返回
  return path
}
