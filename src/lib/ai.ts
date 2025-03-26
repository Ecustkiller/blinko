import { toast } from "@/hooks/use-toast";
import { Store } from "@tauri-apps/plugin-store";
import { fetch, Proxy } from '@tauri-apps/plugin-http'

const chatURL = '/chat/completions'

async function createAi(text: string) {
  const store = await Store.load('store.json')
  const apiKey = await store.get<string>('apiKey')
  const model = await store.get('model')
  const aiType = await store.get<string>('aiType')
  const temperature = await store.get<number>('temperature')
  const topP = await store.get<number>('topP')
  
  // 获取当前选择的面具
  const currentPromptId = await store.get<string>('currentPromptId')
  let promptContent = ''
  
  if (currentPromptId) {
    const promptList = await store.get<Array<{id: string, content: string}>>('promptList')
    if (promptList) {
      const currentPrompt = promptList.find(prompt => prompt.id === currentPromptId)
      if (currentPrompt && currentPrompt.content) {
        promptContent = currentPrompt.content
      }
    }
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  let body: string;
  
  if (aiType === 'gemini') {
    headers.append("x-goog-api-key", apiKey || '');
    
    // 如果有面具内容，添加到请求中
    const finalText = promptContent ? `${promptContent}\n\n${text}` : text;
    
    body = JSON.stringify({
      contents: [{
        parts: [{
          text: finalText
        }]
      }],
      generationConfig: {
        temperature,
        topP,
      },
    });
  } else {
    headers.append("Authorization", `Bearer ${apiKey}`);
    
    // 构建消息数组
    const messages = [];
    
    // 如果有面具内容，添加系统消息
    if (promptContent) {
      messages.push({
        role: 'system',
        content: promptContent
      });
    }
    
    // 添加用户消息
    messages.push({
      role: 'user',
      content: text
    });
    
    body = JSON.stringify({
      model,
      messages: messages,
      stream: false,
      temperature,
      top_p: topP,
    });
  }

  const proxyUrl = await store.get<string>('proxy')
  const proxy: Proxy | undefined = proxyUrl ? {
    all: proxyUrl
  } : undefined

  const requestOptions = {
    method: 'POST',
    headers,
    body,
    proxy
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
    const res = await fetch(url, requestOptions).catch(() => {
      return false
    })
    if (typeof res !== 'boolean' && res.status >= 200 && res.status < 300) {
      const data = await res.json()
      if (data.error) {
        toast({
          title: 'AI 错误',
          description: data.error.message,
          variant: 'destructive',
        })
        return data.error.message
      } else {
        if (aiType === 'ollama') {
          return data.message.content
        } else if (aiType === 'gemini') {
          return data.candidates[0].content.parts[0].text
        } else {
          return data.choices[0].message.content
        }
      }
    }
    return '请求失败，请检查网络连接或 AI 配置是否正确。'
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

export async function checkAiStatus() {
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const aiType = await store.get<string>('aiType')
  const model = await store.get<string>('model')
  if (!baseURL || !aiType) return
  let url: string;
  if (aiType === 'ollama') {
    url = baseURL + '/api/chat'
  } else if (aiType === 'gemini') {
    url = baseURL + `/models/${model}:generateContent`
  } else {
    url = baseURL + chatURL
  }
  if (!url) return;
  const { requestOptions } = await createAi('')
  const res = await fetch(url, requestOptions).catch(() => {
    return false
  })
  if (typeof res !== 'boolean' && res.status >= 200 && res.status < 300) {
    const data = await res.json()
    if (data.error) {
      return false
    } else {
      return true
    }
  }
}