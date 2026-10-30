import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VegetationService } from './vegetation.service';

describe('VegetationService', () => {
  let service: VegetationService;
  let dataSource: { query: jest.Mock };
  let originalClientId: string | undefined;
  let originalClientSecret: string | undefined;

  beforeEach(() => {
    originalClientId = process.env.SENTINEL_HUB_CLIENT_ID;
    originalClientSecret = process.env.SENTINEL_HUB_CLIENT_SECRET;
    dataSource = { query: jest.fn() };
    service = new VegetationService(dataSource as unknown as DataSource);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalClientId === undefined) delete process.env.SENTINEL_HUB_CLIENT_ID; else process.env.SENTINEL_HUB_CLIENT_ID = originalClientId;
    if (originalClientSecret === undefined) delete process.env.SENTINEL_HUB_CLIENT_SECRET; else process.env.SENTINEL_HUB_CLIENT_SECRET = originalClientSecret;
  });

  it('rejects invalid or future date ranges before querying the database', async () => {
    await expect(service.createJob('10', '20', { dateFrom: '2027-01-01', dateTo: '2027-01-02' })).rejects.toBeInstanceOf(BadRequestException);
    expect(dataSource.query).not.toHaveBeenCalled();
  });

  it('requires an owned parcel and a saved polygon', async () => {
    dataSource.query.mockResolvedValueOnce([]);
    await expect(service.createJob('10', '20', { dateFrom: '2026-01-01', dateTo: '2026-01-02' })).rejects.toBeInstanceOf(NotFoundException);
    expect(dataSource.query.mock.calls[0][0]).toContain('f.user_id = $2');

    dataSource.query.mockResolvedValueOnce([{ id: '20', boundary: null }]);
    await expect(service.createJob('10', '20', { dateFrom: '2026-01-01', dateTo: '2026-01-02' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('queues an idempotent processing job for a farmer-owned polygon', async () => {
    dataSource.query.mockResolvedValueOnce([{ id: '20', boundary: { type: 'Polygon', coordinates: [] } }])
      .mockResolvedValueOnce([{ id: '31', status: 'queued', provider: 'sentinel_hub' }]);
    const job = await service.createJob('10', '20', { dateFrom: '2026-01-01', dateTo: '2026-01-02', maxCloudCoverage: 20 });
    expect(job).toMatchObject({ id: '31', status: 'queued' });
    expect(dataSource.query.mock.calls[0][1]).toEqual(['20', '10']);
    expect(dataSource.query.mock.calls[1][0]).toContain('ON CONFLICT (idempotency_key)');
    expect(dataSource.query.mock.calls[1][1][2]).toMatch(/^[a-f0-9]{64}$/);
  });

  it('requires ownership when retrying an existing job', async () => {
    dataSource.query.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: '5', status: 'complete' }]);
    await expect(service.retryJob('10', '5')).rejects.toBeInstanceOf(ConflictException);
    expect(dataSource.query.mock.calls[0][0]).toContain('f.user_id = $2');
  });

  it('uses Sentinel-2 red/NIR data masks and persists only provider statistics', async () => {
    process.env.SENTINEL_HUB_CLIENT_ID = 'test-client';
    process.env.SENTINEL_HUB_CLIENT_SECRET = 'test-secret';
    const saved = jest.fn();
    (dataSource as any).transaction = jest.fn(async (callback: (manager: { query: jest.Mock }) => Promise<void>) => callback({ query: saved }));
    dataSource.query.mockResolvedValueOnce([{ boundary: { type: 'Polygon', coordinates: [] } }]);
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'fixture-token', expires_in: 600 }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{
        interval: { from: '2026-10-28T00:00:00Z', to: '2026-10-29T00:00:00Z' },
        outputs: {
          ndvi: { bands: { B0: { stats: { mean: 0.42, min: 0.15, max: 0.77, sampleCount: 80 } } } },
          cloud: { bands: { B0: { stats: { mean: 0.125, sampleCount: 100 } } } },
        },
      }] }) } as Response);

    await (service as any).processJob({ id: '31', parcel_id: '20', date_from: '2026-10-28', date_to: '2026-10-29', max_cloud_coverage: 30 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const apiRequest = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(apiRequest.input.data[0].type).toBe('sentinel-2-l2a');
    expect(apiRequest.aggregation.evalscript).toContain('"B04", "B08", "SCL", "dataMask"');
    expect(apiRequest.aggregation.evalscript).toContain('dataMask: [validNdvi ? 1 : 0, hasData ? 1 : 0]');
    expect(saved.mock.calls[0][1]).toEqual(['20', '31', '2026-10-28', '2026-10-28T00:00:00Z', '2026-10-29T00:00:00Z', 0.42, 0.15, 0.77, 12.5, 80, expect.any(String)]);
    expect(saved.mock.calls[1][0]).toContain("status = 'complete'");

  });
});
