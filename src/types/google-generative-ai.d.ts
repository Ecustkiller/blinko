declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): GenerativeModel;
  }

  export class GenerativeModel {
    generateContent(prompt: string | Array<string | any>, options?: GenerationConfig): Promise<ContentResponse>;
    generateContentStream(prompt: string | Array<string | any>, options?: GenerationConfig): Promise<StreamContentResponse>;
  }

  export interface GenerationConfig {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
    candidateCount?: number;
    generationConfig?: any;
  }

  export interface ContentResponse {
    response: {
      text: () => string;
      candidates: Array<any>;
    };
    promptFeedback?: any;
  }

  export interface StreamContentResponse {
    stream: AsyncIterable<ChunkResponse>;
  }

  export interface ChunkResponse {
    text: () => string;
  }
}
