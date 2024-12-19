export interface AiResult {
  id: string;
  choices: Choice[];
  created: number;
  model: string;
  object: string;
  usage: Usage;
  system_fingerprint: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface Choice {
  index: number;
  message: Message;
  logprobs: null;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}

export interface AiModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}