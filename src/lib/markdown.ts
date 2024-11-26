// 根据 markdown 截取标题
export function extractTitle(content: string) {
  const decodeContent = decodeURIComponent(content)
  const regex = /^# (.*)/m
  const match = decodeContent.match(regex)
  if (match) {
    return match[1]
  }
  return ''
}