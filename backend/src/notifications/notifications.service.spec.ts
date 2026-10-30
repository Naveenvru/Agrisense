import { NotificationsService } from './notifications.service';

describe('NotificationsService channel policy', () => {
  const prefs = { whatsappEnabled: true, smsEnabled: true };
  const repository = (extra: Record<string, unknown> = {}) => ({ findOne: jest.fn().mockResolvedValue(prefs), save: jest.fn(async (value) => value), create: jest.fn((value) => value), find: jest.fn().mockResolvedValue([]), ...extra });
  const build = (consents: any[]) => {
    const preferenceRepo = repository();
    const consentRepo = repository({ find: jest.fn().mockResolvedValue(consents) });
    return new NotificationsService(preferenceRepo as any, consentRepo as any, repository() as any, repository() as any, { get: jest.fn() } as any);
  };

  it('does not treat WhatsApp consent as SMS consent', async () => {
    const service = build([{ channel: 'whatsapp', consentStatus: 'granted' }]);
    expect(await service.getDeliveryPlan('12')).toEqual(['whatsapp']);
    expect(await service.getNextDeliveryChannel('12', 'whatsapp', true)).toBeNull();
  });

  it('allows SMS only as fallback after failed WhatsApp with separate SMS consent', async () => {
    const service = build([
      { channel: 'sms', consentStatus: 'granted' },
      { channel: 'whatsapp', consentStatus: 'granted' },
    ]);
    expect(await service.getNextDeliveryChannel('12')).toBe('whatsapp');
    expect(await service.getNextDeliveryChannel('12', 'whatsapp', false)).toBeNull();
    expect(await service.getNextDeliveryChannel('12', 'whatsapp', true)).toBe('sms');
  });
});
