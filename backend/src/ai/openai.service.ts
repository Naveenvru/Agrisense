import { Injectable, Logger, ServiceUnavailableException, GatewayTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OpenAiMessage { role: 'developer' | 'user' | 'assistant'; content: string; }
export interface OpenAiFunctionTool { type: 'function'; name: string; description: string; parameters: Record<string, unknown>; }

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly model: string;
  private readonly apiKey?: string;

  constructor(config: ConfigService) {
    this.model = config.get<string>('OPENAI_MODEL') || 'gpt-4.1-mini';
    this.apiKey = config.get<string>('OPENAI_API_KEY');
  }

  async create(input: string | unknown[], instructions: string, tools: OpenAiFunctionTool[] = [], previousResponseId?: string): Promise<any> {
    if (!this.apiKey) throw new ServiceUnavailableException('OpenAI is not configured. Set OPENAI_API_KEY on the backend.');
    const payload: Record<string, unknown> = { model: this.model, instructions, input, store: true };
    if (tools.length) {
      payload.tools = tools;
      payload.tool_choice = 'auto';
      payload.parallel_tool_calls = false;
    }
    if (previousResponseId) payload.previous_response_id = previousResponseId;

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error: any) {
      if (error?.name === 'TimeoutError' || error?.name === 'AbortError') throw new GatewayTimeoutException('OpenAI took too long to respond. Please try again.');
      this.logger.warn(`OpenAI transport failed (${error?.name || 'network error'}).`);
      throw new ServiceUnavailableException('Could not connect to the AgriSense AI provider.');
    }
    if (response.status === 429) throw new ServiceUnavailableException('AgriSense AI is busy. Please wait a moment and try again.');
    if (!response.ok) {
      const status = response.status;
      this.logger.warn(`OpenAI Responses API returned HTTP ${status}.`);
      if (status === 401 || status === 403) throw new ServiceUnavailableException('OpenAI authentication failed. Check OPENAI_API_KEY on the backend.');
      throw new ServiceUnavailableException('AgriSense AI could not complete the request. Please try again.');
    }
    return response.json();
  }
}
