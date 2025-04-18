declare module '@google/genai' {
  export interface GoogleGenAIOptions {
    apiKey: string;
  }

  export class GoogleGenAI {
    constructor(options: GoogleGenAIOptions);
    models: {
      generateContent(params: GenerateContentParameters): Promise<GenerateContentResponse>;
      generateContentStream(params: GenerateContentParameters): AsyncGenerator<GenerateContentResponse, any, any>;
    };
  }

  export interface GenerateContentParameters {
    model: string;
    contents: {
      parts: Array<{
        text: string;
      }>;
    };
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
    candidateCount?: number;
  }

  export interface GenerateContentResponse {
    text: string;
    candidates?: Array<any>;
  }
}
