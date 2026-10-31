import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  GatewayTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface McpTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, unknown>;
}

interface McpEnvelope {
  jsonrpc?: string;
  id?: number | string;
  result?: any;
  error?: { code?: number; message?: string; data?: unknown };
}

@Injectable()
export class CommodityMcpClient {
  private readonly logger = new Logger(CommodityMcpClient.name);
  private readonly endpoint: string;
  private readonly token?: string;
  private readonly timeoutMs = 15_000;

  constructor(config: ConfigService) {
    this.endpoint = config.get<string>('COMMODITIES_MCP_URL') || 'https://commodities-api.mcp.commodities-api.com/mcp';
    this.token = config.get<string>('COMMODITIES_MCP_TOKEN');
  }

  async withSession<T>(action: (tools: McpTool[], callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>) => Promise<T>): Promise<T> {
    if (!this.token) throw new ServiceUnavailableException('Commodity price service is not configured. Set COMMODITIES_MCP_TOKEN on the backend.');
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    };
    const init = await this.request(headers, 'initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'agrisense-backend', version: '1.0.0' },
    });
    const sessionId = init.sessionId;
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
    const initialized = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!initialized.ok) this.raiseHttp(initialized.status);

    const toolResult = await this.request(headers, 'tools/list', {});
    const tools = toolResult.envelope?.result?.tools;
    if (!Array.isArray(tools)) throw new ServiceUnavailableException('Commodity price service returned an invalid tool catalog.');
    return action(tools, async (name, args) => {
      const result = await this.request(headers, 'tools/call', { name, arguments: this.withoutCredential(args) });
      if (result.envelope?.result?.isError) {
        const message = this.extractText(result.envelope.result.content) || 'Commodity price provider rejected the request.';
        if (/unauthorized|invalid|expired|paid plan/i.test(message)) {
          this.logger.warn('Commodities MCP rejected its configured credential.');
          throw new UnauthorizedException('Commodity price provider authentication failed. Check the paid plan and COMMODITIES_MCP_TOKEN.');
        }
        throw new ServiceUnavailableException(this.cleanMessage(message));
      }
      return this.sanitizeResult(result.envelope?.result ?? result.envelope);
    });
  }

  private async request(headers: Record<string, string>, method: string, params: Record<string, unknown>) {
    const id = Date.now();
    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST', headers,
        body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error: any) {
      if (error?.name === 'TimeoutError' || error?.name === 'AbortError') throw new GatewayTimeoutException('Commodity price provider timed out. Please try again.');
      this.logger.warn(`Commodities MCP transport failed (${error?.name || 'network error'}).`);
      throw new ServiceUnavailableException('Could not connect to the commodity price provider.');
    }
    if (response.status === 401 || response.status === 403) throw new UnauthorizedException('Commodity price provider authentication failed. Check COMMODITIES_MCP_TOKEN.');
    if (response.status === 429) throw new ServiceUnavailableException('Commodity price provider rate limit reached. Please try again later.');
    if (!response.ok) this.raiseHttp(response.status);

    const sessionId = response.headers.get('mcp-session-id') || undefined;
    const raw = await response.text();
    const envelope = this.parseEnvelope(raw);
    if (envelope?.error) {
      const message = envelope.error.message || 'MCP request failed.';
      if (/unauthorized|invalid|expired|paid plan/i.test(message)) throw new UnauthorizedException('Commodity price provider authentication failed. Check the paid plan and COMMODITIES_MCP_TOKEN.');
      throw new ServiceUnavailableException(this.cleanMessage(message));
    }
    return { envelope, sessionId };
  }

  private parseEnvelope(raw: string): McpEnvelope | undefined {
    try { return JSON.parse(raw) as McpEnvelope; } catch { /* SSE follows */ }
    const data = raw.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n');
    try { return JSON.parse(data) as McpEnvelope; } catch { return undefined; }
  }

  private raiseHttp(status: number): never {
    if (status === 429) throw new ServiceUnavailableException('Commodity price provider rate limit reached. Please try again later.');
    if (status === 401 || status === 403) throw new UnauthorizedException('Commodity price provider authentication failed. Check COMMODITIES_MCP_TOKEN.');
    this.logger.warn(`Commodities MCP returned HTTP ${status}.`);
    throw new ServiceUnavailableException('Commodity price provider is temporarily unavailable.');
  }

  private withoutCredential(args: Record<string, unknown>) {
    const safe = { ...args };
    delete safe.api_key;
    return safe;
  }

  private extractText(content: unknown): string {
    if (!Array.isArray(content)) return '';
    return content.filter((item: any) => item?.type === 'text').map((item: any) => String(item.text || '')).join('\n');
  }

  private sanitizeResult(value: unknown): unknown {
    if (typeof value === 'string') return value.slice(0, 20_000);
    const encoded = JSON.stringify(value ?? null);
    if (encoded.length > 20_000) throw new ServiceUnavailableException('Commodity price provider response exceeded the supported size.');
    return value;
  }

  private cleanMessage(message: string): string {
    return message.replace(/https?:\/\/\S+/gi, '[provider link]').slice(0, 500);
  }
}
