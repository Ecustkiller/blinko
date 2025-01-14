import { Store } from "@tauri-apps/plugin-store";
import OpenAI from 'openai'
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions.mjs";

async function createClient() {
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const apiKey = await store.get<string>('apiKey')
  const openai = new OpenAI({
    apiKey,
    baseURL,
    dangerouslyAllowBrowser: true,
  })
  return openai
}

async function createAi(text: string) {
  const store = await Store.load('store.json')
  const model = await store.get<string>('model')

  const body: ChatCompletionCreateParamsNonStreaming = {
    model: model || 'gpt-4o',
    messages: [
        {
          role: 'user',
          content: text,
          name: 'user'
        }
    ],
  }
  return body;
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
  return await fetch('https://api.chatanywhere.tech/v1/models', requestOptions)
    .then(response => response.json())
}

export async function fetchAiStream(text: string, callback: (text: string) => void) {
  const client = await createClient()
  const requestOptions = await createAi(text)

  const stream = await client.chat.completions.create({
    ...requestOptions,
   stream: true,
  });
  for await (const chunk of stream) {
    callback(chunk.choices[0]?.delta?.content || '')
  }
}

export async function fetchAi(text: string): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const client = await createClient()
  const requestOptions = await createAi(text)
  const chatCompletion = await client.chat.completions.create(requestOptions);
  return chatCompletion
}

export async function fetchAiDesc(text: string) {
  const client = await createClient()
  const descContent = `
    根据内容：${text}，返回一段关于截图的描述，不要超过50字，不要包含特殊字符。
  `
  const requestOptions = await createAi(descContent)
  const chatCompletion = await client.chat.completions.create(requestOptions);
  return chatCompletion
}