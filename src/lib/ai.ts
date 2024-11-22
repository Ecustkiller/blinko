import { Store } from "@tauri-apps/plugin-store";

export async function fetchAiStream(text: string, callback: (text: string) => void) {
  const store = await Store.load('store.json')
  const apiKey = await store.get('apiKey')

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiKey}`);
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    stream: true,
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

  await fetch("https://api.chatanywhere.tech/v1/chat/completions", requestOptions)
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