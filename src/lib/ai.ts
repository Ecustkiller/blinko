import { toast } from "@/hooks/use-toast";
import { Store } from "@tauri-apps/plugin-store";
import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";

/**
 * 获取当前的prompt内容
 */
async function getPromptContent(): Promise<string> {
  const store = await Store.load('store.json')
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
  
  return promptContent
}

/**
 * 获取AI设置
 */
async function getAISettings() {
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const apiKey = await store.get<string>('apiKey')
  const model = await store.get<string>('model') || 'gpt-3.5-turbo'
  const aiType = await store.get<string>('aiType') || 'openai'
  const temperature = await store.get<number>('temperature') || 0.7
  const topP = await store.get<number>('topP') || 1
  const chatLanguage = await store.get<string>('chatLanguage') || 'en'
  const proxyUrl = await store.get<string>('proxy')
  
  return {
    baseURL,
    apiKey,
    model,
    aiType,
    temperature,
    topP,
    chatLanguage,
    proxyUrl
  }
}

/**
 * 检查AI服务配置是否有效
 */
async function validateAIService(baseURL: string | undefined): Promise<string | null> {
  if (!baseURL) {
    toast({
      title: 'AI 错误',
      description: '请先设置 AI 地址',
      variant: 'destructive',
    })
    return null
  }
  return baseURL
}

/**
 * 处理AI请求错误
 */
function handleAIError(error: unknown, withToast = true): string | null {
  const errorMessage = error instanceof Error ? error.message : '未知错误'
  
  if (withToast) {
    toast({
      title: 'AI 错误',
      description: errorMessage,
      variant: 'destructive',
    })
  }
  
  return `请求失败: ${errorMessage}`
}

/**
 * 为不同AI类型准备消息
 */
async function prepareMessages(text: string, aiType: string, includeLanguage = false): Promise<{
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  geminiText?: string
}> {
  // 获取prompt内容
  let promptContent = await getPromptContent()
  
  if (includeLanguage) {
    const store = await Store.load('store.json')
    const chatLanguage = await store.get<string>('chatLanguage') || 'en'
    promptContent += '\n\n' + `Use **${chatLanguage}** to answer.`
  }
  
  // 定义消息数组
  let messages: OpenAI.Chat.ChatCompletionMessageParam[] = []
  let geminiText: string | undefined
  
  // 根据不同AI类型构建请求
  if (aiType === 'gemini') {
    // 对于Gemini，我们将使用@google/genai库
    const finalText = promptContent ? `${promptContent}\n\n${text}` : text
    messages = [{
      role: 'user', 
      content: finalText
    }]
    geminiText = finalText
  } else {
    // OpenAI/Ollama 请求
    if (promptContent) {
      messages.push({
        role: 'system',
        content: promptContent
      })
    }
    
    messages.push({
      role: 'user',
      content: text
    })
  }
  
  return { messages, geminiText }
}

/**
 * 创建OpenAI客户端，适用于所有AI类型
 */
async function createOpenAIClient() {
  const store = await Store.load('store.json')
  const baseURL = await store.get<string>('baseURL')
  const apiKey = await store.get<string>('apiKey')
  const proxyUrl = await store.get<string>('proxy')
  
  // 创建OpenAI客户端
  return new OpenAI({
    apiKey: apiKey || '',
    baseURL: baseURL,
    dangerouslyAllowBrowser: true,
    defaultHeaders:{
      "x-stainless-arch": null,
      "x-stainless-lang": null,
      "x-stainless-os": null,
      "x-stainless-package-version": null,
      "x-stainless-retry-count": null,
      "x-stainless-runtime": null,
      "x-stainless-runtime-version": null,
      "x-stainless-timeout": null,
    },
    ...(proxyUrl ? { httpAgent: proxyUrl } : {})
  })
}

// 创建Google Gemini客户端
async function createGeminiClient() {
  const store = await Store.load('store.json')
  const apiKey = await store.get<string>('apiKey')
  
  // 创建Gemini客户端
  return new GoogleGenAI({apiKey: apiKey || ''});
}

/**
 * 非流式方式获取AI结果
 */
export async function fetchAi(text: string): Promise<string> {
  try {
    // 获取AI设置
    const { baseURL, model, aiType, temperature, topP } = await getAISettings()
    
    // 验证AI服务
    if (validateAIService(baseURL) === null) return ''
    
    // 准备消息
    const { messages, geminiText } = await prepareMessages(text, aiType)
    
    // 根据不同AI类型构建请求
    if (aiType === 'gemini') {
      // 创建Gemini客户端
      const genAI = await createGeminiClient()
      
      const result = await genAI.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: geminiText || text }]
        },
        temperature: temperature,
        topP: topP
      })
      
      return result.text || ''
    } else {
      // OpenAI/Ollama请求
      const openai = await createOpenAIClient()
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        top_p: topP,
      })
      
      return completion.choices[0].message.content || ''
    }
  } catch (error) {
    return handleAIError(error) || ''
  }
}

/**
 * 流式方式获取AI结果
 * @param text 请求文本
 * @param onUpdate 每次收到流式内容时的回调函数
 * @param abortSignal 用于终止请求的信号
 */
export async function fetchAiStream(text: string, onUpdate: (content: string) => void, abortSignal?: AbortSignal): Promise<string> {
  try {
    // 获取AI设置
    const { baseURL, model, aiType, temperature, topP } = await getAISettings()
    
    // 验证AI服务
    if (await validateAIService(baseURL) === null) return ''
    
    // 准备消息
    const { messages, geminiText } = await prepareMessages(text, aiType, true)
    
    // 根据不同AI类型进行流式请求
    if (aiType === 'gemini') {
      // Gemini API流式请求使用@google/genai
      const genAI = await createGeminiClient()
      
      let fullContent = ''
      const response = await genAI.models.generateContentStream({
        model: model,
        contents: {
          parts: [{ text: geminiText || text }]
        },
        temperature: temperature,
        topP: topP
      })
      
      for await (const chunk of response) {
        // Check if the request has been aborted
        if (abortSignal?.aborted) {
          break;
        }
        
        if (chunk.text) {
          fullContent += chunk.text
          onUpdate(fullContent)
        }
      }
      
      return fullContent
    } else {
      // OpenAI/Ollama流式请求
      const openai = await createOpenAIClient()
      const stream = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        top_p: topP,
        stream: true,
      })
      
      let thinking = ''
      let fullContent = ''
      
      for await (const chunk of stream) {
        // Check if the request has been aborted
        if (abortSignal?.aborted) {
          break;
        }
        
        const thinkingContent = (chunk.choices[0]?.delta as any)?.reasoning_content || ''
        const content = chunk.choices[0]?.delta?.content || ''
        // 如果存在 thinkingContent 则每次将内容插入到 fullContent 的 <thinking></thinking> 标签中，只保留一个<thinking></thinking>标签
        if (thinkingContent) {
          thinking += thinkingContent
          fullContent = `<thinking>${thinking}<thinking>`
        }
        if (content) {
          fullContent += content
        }
        onUpdate(fullContent)
      }
      
      return fullContent
    }
  } catch (error) {
    return handleAIError(error) || ''
  }
}

/**
 * 流式方式获取AI结果，每次返回本次 token
 * @param text 请求文本
 * @param onUpdate 每次收到流式内容时的回调函数
 */
export async function fetchAiStreamToken(text: string, onUpdate: (content: string) => void): Promise<string> {
  try {
    // 获取AI设置
    const { baseURL, model, aiType, temperature, topP } = await getAISettings()
    
    // 验证AI服务
    if (await validateAIService(baseURL) === null) return ''
    
    // 准备消息
    const { messages, geminiText } = await prepareMessages(text, aiType, true)
    
    // 根据不同AI类型进行流式请求
    if (aiType === 'gemini') {
      // Gemini API流式请求使用@google/genai
      const genAI = await createGeminiClient()
      
      const streamingResult = await genAI.models.generateContentStream({
        model: model,
        contents: {
          parts: [{ text: geminiText || text }]
        },
        temperature: temperature,
        topP: topP
      })
      
      for await (const chunk of streamingResult) {
        if (chunk.text) {
          onUpdate(chunk.text)
        }
      }
      
      return ''
    } else {
      // OpenAI/Ollama流式请求
      const openai = await createOpenAIClient()
      const stream = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        top_p: topP,
        stream: true,
      })
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          onUpdate(content)
        }
      }
      
      return ''
    }
  } catch (error) {
    return handleAIError(error) || ''
  }
}

export async function fetchAiDesc(text: string) {
  try {
    // 获取AI设置
    const { baseURL, model, aiType, temperature, topP } = await getAISettings()
    
    if (!baseURL) return null;
    
    const descContent = `
      根据截图的内容：${text}，返回一条描述，不要超过50字，不要包含特殊字符。
    `
    
    if (aiType === 'gemini') {
      // 创建 Gemini 客户端
      const genAI = await createGeminiClient()
      
      // 使用 Gemini API
      const result = await genAI.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: descContent }]
        }
      })
      
      // 获取响应文本
      return result.candidates?.[0]?.content?.parts?.[0]?.text || ''      
    } else {
      // 创建 OpenAI 客户端
      const openai = await createOpenAIClient()
      
      // OpenAI/Ollama使用OpenAI库
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{
          role: 'user' as const,
          content: descContent
        }],
        temperature: temperature,
        top_p: topP,
      })
      
      return completion.choices[0].message.content || ''
    }
  } catch (error) {
    return handleAIError(error, false) || null
  }
}

export async function checkAiStatus() {
  try {
    // 获取AI设置
    const { baseURL, model, aiType } = await getAISettings()
    
    if (!baseURL || !aiType) return false
    
    if (aiType === 'gemini') {
      // Gemini - 使用@google/genai
      const genAI = await createGeminiClient()
      
      await genAI.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: 'Hello' }]
        }
      })
    } else {
      // OpenAI/Ollama
      const openai = await createOpenAIClient()
      await openai.chat.completions.create({
        model,
        messages: [{
          role: 'user' as const,
          content: 'Hello'
        }],
      })
    }
    return true
  } catch {
    // 捕获错误但不处理
    return false
  }
}

export async function getModels() {
  try {
    // 获取AI设置
    const { baseURL, aiType } = await getAISettings()
    
    if (!baseURL || !aiType) return []
    
    if (aiType === 'gemini') {
      return []
    } else {
      // OpenAI/Ollama模型列表
      const openai = await createOpenAIClient()
      const models = await openai.models.list()
      const uniqueModels = models.data.filter((model, index) => models.data.findIndex(m => m.id === model.id) === index)
      return uniqueModels
    }
  } catch {
    return []
  }
}