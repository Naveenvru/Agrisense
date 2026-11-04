import { AiGatewayService } from './ai-gateway.service';
import { IntentRouterService } from './routing/intent-router.service';

describe('AiGatewayService', () => {
  const toolCatalog = [{
    name: 'commodities.latest',
    description: 'Get the most recent commodity prices.',
    inputSchema: {
      type: 'object',
      properties: {
        symbols: { type: 'string', description: 'Comma-separated provider symbols.' },
        api_key: { type: 'string' },
      },
      required: ['symbols'],
    },
  }];

  it('does not call the global commodity provider for a local mandi price', async () => {
    const openai = { create: jest.fn() };
    const mcp = { withSession: jest.fn() };
    const market = { getPricesForUser: jest.fn() };
    const gateway = new AiGatewayService(openai as any, mcp as any, new IntentRouterService(), market as any);

    const result = await gateway.chat('What is today’s tomato price in Hassan?', [], 'user-1');

    expect(result.intent).toBe('CURRENT_COMMODITY_PRICE');
    expect(result.text).toContain('does not provide Indian mandi/APMC records');
    expect(mcp.withSession).not.toHaveBeenCalled();
    expect(openai.create).not.toHaveBeenCalled();
  });

  it('discovers MCP schemas and completes an OpenAI function-call round trip', async () => {
    const openai = {
      create: jest.fn()
        .mockResolvedValueOnce({
          output: [{ type: 'function_call', name: 'mcp_commodities_latest', call_id: 'call-1', arguments: '{"symbols":"XAU"}' }],
        })
        .mockResolvedValueOnce({ output_text: 'The provider returned a gold quote.', model: 'test-model', output: [] }),
    };
    const callTool = jest.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"success":true,"rates":{"XAU":1}}' }] });
    const market = { getPricesForUser: jest.fn() };
    const mcp = {
      withSession: jest.fn(async (action: (tools: typeof toolCatalog, call: typeof callTool) => Promise<unknown>) => action(toolCatalog, callTool)),
    };
    const gateway = new AiGatewayService(openai as any, mcp as any, new IntentRouterService(), market as any);

    const result = await gateway.chat('What is the current gold price?', [{ role: 'user', content: 'Hi' }], 'user-1');

    expect(result.text).toBe('The provider returned a gold quote.');
    expect(result.intent).toBe('CURRENT_COMMODITY_PRICE');
    expect(openai.create).toHaveBeenCalledTimes(2);
    const passedTools = openai.create.mock.calls[0][2];
    expect(passedTools[0].name).toBe('mcp_commodities_latest');
    expect(passedTools[0].parameters.properties.api_key).toBeUndefined();
    expect(callTool).toHaveBeenCalledWith('commodities.latest', { symbols: 'XAU' });
  });

  it('answers in Kannada and refuses unavailable mandi data without guessing', async () => {
    const openai = { create: jest.fn() };
    const mcp = { withSession: jest.fn() };
    const market = { getPricesForUser: jest.fn() };
    const gateway = new AiGatewayService(openai as any, mcp as any, new IntentRouterService(), market as any);

    const result = await gateway.chat('ಹಾಸನದಲ್ಲಿ ಇಂದಿನ ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?', [], 'user-1');

    expect(result.text).toContain('ಮಂಡಿ/APMC');
    expect(mcp.withSession).not.toHaveBeenCalled();
  });

  it('uses stored records for historical mandi data and includes their data context', async () => {
    const records = [{ commodity: 'Tomato', market: 'Hassan', date: '2026-10-25', modalPrice: 2400, source: 'mandi-api' }];
    const openai = { create: jest.fn().mockResolvedValue({ output_text: 'A recorded historical price was ₹2,400.', output: [] }) };
    const mcp = { withSession: jest.fn() };
    const market = { getPricesForUser: jest.fn().mockResolvedValue(records) };
    const gateway = new AiGatewayService(openai as any, mcp as any, new IntentRouterService(), market as any);

    const result = await gateway.chat('Show historical tomato prices in Hassan last week', [], 'user-1');

    expect(market.getPricesForUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ commodity: 'tomato', district: 'Hassan', limit: 100 }));
    expect(openai.create.mock.calls[0][0][0].content).toContain('Verified AgriSense historical market database records');
    expect((result as any).dataSource).toBe('AgriSense market database');
    expect(mcp.withSession).not.toHaveBeenCalled();
  });
});
