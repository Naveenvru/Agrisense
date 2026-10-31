import { Injectable } from '@nestjs/common';

export type AiIntent =
  | 'CURRENT_COMMODITY_PRICE'
  | 'HISTORICAL_COMMODITY_PRICE'
  | 'PRICE_COMPARISON'
  | 'PRICE_EXPLANATION'
  | 'WEATHER_QUERY'
  | 'CROP_RECOMMENDATION'
  | 'GENERAL_AGRICULTURE_QUERY';

@Injectable()
export class IntentRouterService {
  classify(text: string): AiIntent {
    const value = text.toLocaleLowerCase();
    const marketTerms = /\b(price|prices|rate|rates|market|mandi|commodity|commodities)\b|ಬೆಲೆ|ದರ|ಮಾರುಕಟ್ಟೆ|ಮಂಡಿ/u;
    const historicalTerms = /\b(history|historical|previous|last\s+(day|week|month|year)|trend|over\s+time)\b|ಐತಿಹಾಸಿಕ|ಹಿಂದಿನ/u;
    const compareTerms = /\b(compare|comparison|versus|\bvs\b|difference|fluctuation)\b|ಹೋಲಿಸಿ|ವ್ಯತ್ಯಾಸ/u;
    const explainTerms = /\b(why|explain|meaning|what does .* mean)\b|ಏಕೆ|ವಿವರಿಸಿ/u;

    if (marketTerms.test(value)) {
      if (historicalTerms.test(value)) return 'HISTORICAL_COMMODITY_PRICE';
      if (compareTerms.test(value)) return 'PRICE_COMPARISON';
      if (explainTerms.test(value)) return 'PRICE_EXPLANATION';
      return 'CURRENT_COMMODITY_PRICE';
    }
    if (/\b(weather|rain|rainfall|temperature|forecast)\b|ಹವಾಮಾನ|ಮಳೆ|ತಾಪಮಾನ/u.test(value)) return 'WEATHER_QUERY';
    if (/\b(recommend|recommendation|grow|plant|crop|fertilizer|irrigat|pest|disease)\b|ಬೆಳೆ|ಗೊಬ್ಬರ|ನೀರಾವರಿ|ರೋಗ/u.test(value)) return 'CROP_RECOMMENDATION';
    return 'GENERAL_AGRICULTURE_QUERY';
  }
}
