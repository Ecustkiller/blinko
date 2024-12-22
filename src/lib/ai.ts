import { toast } from "@/hooks/use-toast";
import { Store } from "@tauri-apps/plugin-store";
import { AiResult } from "./ai.types";

const url = 'https://api.chatanywhere.tech/v1/chat/completions'

async function createAi(text: string, isStream = true) {
  const store = await Store.load('store.json')
  const apiKey = await store.get('apiKey')
  const model = await store.get('model')

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiKey}`);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    model,
    stream: isStream,
    messages: [
        {
          role: 'user',
          content: text
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  return requestOptions;
}

// 获取模型
export async function fetchAiModels() {
  const store = await Store.load('store.json')
  const apiKey = await store.get('apiKey')
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiKey}`);
  const requestOptions = {
    method: 'GET',
    headers,
  };
  return (await fetch('https://api.chatanywhere.tech/v1/models', requestOptions)).json()
}

export async function fetchAiStream(text: string, callback: (text: string) => void) {
  const requestOptions = await createAi(text, true)

  await fetch(url, requestOptions)
    .then(response => response.body)
    .then(async (body) => {
      if (body === null) return
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        done = d
        const chunkValue = decoder.decode(value);
        chunkValue.split('data: ').map(item => {
          const str = item.trim()
          if (str && str !== '[DONE]') {
            try {
              const json = JSON.parse(str)
              const content = json.choices[0].delta.content
              if (content) {
                callback(content)
              }
            } catch {
            }
          }
        })
      }
      callback('[DONE]')
    })
}

export async function fetchAi(text: string): Promise<AiResult> {
  const requestOptions = await createAi(text, false)
  return (await fetch(url, requestOptions)).json()
}

export async function fetchAiDesc(text: string) {
  const descContent = `
    根据内容：${text}，返回一段关于截图的描述，不要超过50字，不要包含特殊字符。
  `
  const requestOptions = await createAi(descContent, false)
  const res = await (await fetch(url, requestOptions)).json()
  if (res.error) {
    toast({
      title: 'AI 错误',
      description: res.error.message,
      variant: 'destructive',
    })
    return null
  } else {
    return res
  }
}