import { apiClient } from '@/lib/axios';

export interface AiChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatResponse {
  success: boolean;
  data: {
    text: string;
    model: string;
    intent: string;
  };
}

export const aiGatewayService = {
  sendChatMessage: async (prompt: string, history?: AiChatHistoryMessage[]): Promise<string> => {
    const response = await apiClient.post<AiChatResponse>('/ai/chat', { prompt, history });
    return response.data.data.text;
  },
};
