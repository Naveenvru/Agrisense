import { apiClient } from '@/lib/axios';

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GeminiResponse {
  success: boolean;
  data: {
    text: string;
    model: string;
  };
}

export interface GeminiExplainResponse {
  success: boolean;
  data: {
    explanation: string;
    model: string;
  };
}

export interface GeminiDiseaseResponse {
  success: boolean;
  data: {
    diagnosis: string;
    model: string;
  };
}

export const geminiService = {
  sendChatMessage: async (prompt: string, history?: ChatHistoryMessage[]): Promise<string> => {
    const response = await apiClient.post<GeminiResponse>('/gemini/chat', {
      prompt,
      history,
    });
    return response.data.data.text;
  },

  explainContext: async (
    title: string,
    contextData: Record<string, any>,
    customQuery?: string,
  ): Promise<string> => {
    const response = await apiClient.post<GeminiExplainResponse>('/gemini/explain', {
      title,
      contextData,
      customQuery,
    });
    return response.data.data.explanation;
  },

  analyzeDisease: async (params: {
    imageBase64: string;
    mimeType?: string;
    cropName?: string;
    notes?: string;
  }): Promise<{ diagnosis: string; model: string }> => {
    const response = await apiClient.post<GeminiDiseaseResponse>('/gemini/analyze-disease', params);
    return response.data.data;
  },
};
