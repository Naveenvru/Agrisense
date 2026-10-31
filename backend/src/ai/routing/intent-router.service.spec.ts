import { IntentRouterService } from './intent-router.service';

describe('IntentRouterService', () => {
  const router = new IntentRouterService();

  it.each([
    ['What is the price of gold today?', 'CURRENT_COMMODITY_PRICE'],
    ['Show historical onion prices last week', 'HISTORICAL_COMMODITY_PRICE'],
    ['Compare tomato prices across markets', 'PRICE_COMPARISON'],
    ['Why did the market rate change?', 'PRICE_EXPLANATION'],
    ['Will it rain tomorrow?', 'WEATHER_QUERY'],
    ['Recommend a crop for this season', 'CROP_RECOMMENDATION'],
    ['ನಾಳೆ ಮಳೆ ಬರುತ್ತದೆಯೇ?', 'WEATHER_QUERY'],
    ['ಇಂದಿನ ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?', 'CURRENT_COMMODITY_PRICE'],
    ['How do I improve soil health?', 'GENERAL_AGRICULTURE_QUERY'],
  ] as const)('classifies "%s"', (prompt, expected) => {
    expect(router.classify(prompt)).toBe(expected);
  });
});
