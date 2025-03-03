import { toast } from "@/hooks/use-toast";
import { Store } from "@tauri-apps/plugin-store";
import { fetch } from '@tauri-apps/plugin-http'

const chatURL = '/chat/completions'

async function createAi(text: string) {
  const store = await Store.load('store.json')
  const apiKey = await store.get<string>('apiKey')
  const model = await store.get('model')
  const aiType = await store.get<string>('aiType')

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  let body: string;
  
  if (aiType === 'gemini') {
    headers.append("x-goog-api-key", apiKey || '');
    body = JSON.stringify({
      contents: [{
        parts: [{
          text: text
        }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
  } else {
    headers.append("Authorization", `Bearer ${apiKey}`);
    body = JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: text
        }
      ],
      stream: false
    });
  }

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  return { requestOptions, aiType };
}

export async function fetchAi(text: string): Promise<string> {
  const { requestOptions, aiType } = await createAi(text)
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const model = await store.get<string>('model')
  
  let url: string;
  if (aiType === 'ollama') {
    url = baseURL + '/api/chat'
  } else if (aiType === 'gemini') {
    url = baseURL + `/models/${model}:generateContent`
  } else {
    url = baseURL + chatURL
  }

  if (!url) {
    toast({
      title: 'AI 错误',
      description: '请先设置 AI 地址',
      variant: 'destructive',
    })
  } else {
    const res = await (await fetch(url, requestOptions)).json()
    if (res.error) {
      toast({
        title: 'AI 错误',
        description: res.error.message,
        variant: 'destructive',
      })
      return res.error.message
    } else {
      if (aiType === 'ollama') {
        return res.message.content
      } else if (aiType === 'gemini') {
        return res.candidates[0].content.parts[0].text
      } else {
        return res.choices[0].message.content
      }
    }
  }
  return ''
}

export async function fetchAiDesc(text: string) {
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const aiType = await store.get<string>('aiType')
  const model = await store.get<string>('model')
  
  let url: string;
  if (aiType === 'ollama') {
    url = baseURL + '/api/chat'
  } else if (aiType === 'gemini') {
    url = baseURL + `/models/${model}:generateContent`
  } else {
    url = baseURL + chatURL
  }

  if (!url) return;
  const descContent = `
    根据内容：${text}，返回一段关于截图的描述，不要超过50字，不要包含特殊字符。
  `
  const { requestOptions } = await createAi(descContent)
  const res = await (await fetch(url, requestOptions)).json()
  if (res.error) {
    toast({
      title: 'AI 错误',
      description: res.error.message,
      variant: 'destructive',
    })
    return null
  } else {
    if (aiType === 'ollama') {
      return res.message.content
    } else if (aiType === 'gemini') {
      return res.candidates[0].content.parts[0].text
    } else {
      return res.choices[0].message.content
    }
  }
}