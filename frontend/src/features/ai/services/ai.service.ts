import { ExplainableDecisionData } from '../types';

export const mockExplainableData: ExplainableDecisionData = {
  recommendation: {
    id: 'rec-1',
    title: 'Delay Harvest by 3 Days',
    description: 'Upcoming rain followed by clear weather will increase marketable yield by avoiding moisture damage.',
    confidence: 88,
    expectedProfitIncrease: '₹12,500',
    affectedFarm: 'North Parcel',
    affectedCrop: 'Paddy (IR64)',
    riskLevel: 'low',
    explanations: [
      { factor: 'Weather', impact: 'positive', description: 'Rain expected in 24h, clear thereafter.' },
      { factor: 'Market', impact: 'positive', description: 'Price trending upwards by 5% over next week.' },
      { factor: 'Yield', impact: 'neutral', description: 'Grain moisture currently too high for optimal milling.' },
      { factor: 'Demand', impact: 'positive', description: 'Local festival demand peaking in 7 days.' }
    ],
    actions: [
      { id: 'act-1', label: 'Apply Recommendation', variant: 'primary', actionType: 'apply' },
      { id: 'act-2', label: 'Simulate Outcomes', variant: 'secondary', actionType: 'simulate' }
    ]
  },
  pipeline: [
    {
      id: 'node-farmer',
      engine: 'farmer-data',
      label: 'Farmer Data',
      iconType: 'user',
      status: 'completed',
      executionTimeMs: 45,
      confidence: 100,
      inputs: { farmerId: 'F-1029', cropId: 'C-992', fieldSize: '4.2 Acres' },
      outputs: { crop: 'Paddy (IR64)', sowingDate: '2026-06-01', location: 'Devanahalli, KA' },
      businessRules: ['Data loaded successfully', 'Active crop cycle validated'],
      featureImportance: [],
      shapValues: []
    },
    {
      id: 'node-weather',
      engine: 'weather-intelligence',
      label: 'Weather Intelligence',
      iconType: 'cloud-rain',
      status: 'completed',
      executionTimeMs: 210,
      confidence: 92,
      inputs: { location: '13.24, 77.71', source: 'IMD API' },
      outputs: { condition: 'Rain expected', rainfall: '45mm', humidity: '85%' },
      businessRules: [
        'If rainfall > 30mm within 48h, set HarvestRisk = High',
        'If humidity > 80%, increase DiseaseRisk multiplier'
      ],
      recommendation: 'Expect heavy rain in 24-48 hours. Secure harvested crops.',
      featureImportance: [
        { feature: '48h_Rainfall', weight: 85 },
        { feature: 'Humidity', weight: 15 }
      ],
      shapValues: []
    },
    {
      id: 'node-harvest',
      engine: 'harvest-intelligence',
      label: 'Harvest Intelligence',
      iconType: 'scissors',
      status: 'completed',
      executionTimeMs: 180,
      confidence: 85,
      inputs: { cropStage: 'Ripening', daysElapsed: 105, weatherRisk: 'High' },
      outputs: { readinessScore: 82, optimalWindow: 'Sep 23 - Sep 28', delayDays: 3 },
      businessRules: [
        'Base harvest date + DelayDays if weatherRisk == High',
        'ReadinessScore > 80 is required for optimal quality'
      ],
      recommendation: 'Delay harvest by 3 days to bypass rain.',
      featureImportance: [
        { feature: 'Days_Elapsed', weight: 60 },
        { feature: 'Weather_Risk', weight: 40 }
      ],
      shapValues: []
    },
    {
      id: 'node-yield',
      engine: 'yield-intelligence',
      label: 'Yield Intelligence',
      iconType: 'wheat',
      status: 'completed',
      executionTimeMs: 420,
      confidence: 88,
      inputs: { area: 4.2, harvestScore: 82, diseaseIncidence: 0 },
      outputs: { expectedYieldKg: 5200, potentialLossKg: 120, quality: 'Grade A' },
      businessRules: [
        'Expected Yield = Area * HistoricalAvg * ReadinessMultiplier',
        'Loss is estimated based on current moisture levels'
      ],
      featureImportance: [
        { feature: 'Area', weight: 50 },
        { feature: 'Harvest_Score', weight: 30 },
        { feature: 'Historical_Avg', weight: 20 }
      ],
      shapValues: []
    },
    {
      id: 'node-supply',
      engine: 'supply-intelligence',
      label: 'Supply Intelligence',
      iconType: 'truck',
      status: 'completed',
      executionTimeMs: 150,
      confidence: 75,
      inputs: { villageId: 'V-102', districtId: 'D-55', expectedYield: 5200 },
      outputs: { villageSupplyKg: 22000, districtSupplyKg: 450000, supplyPressure: 'Medium' },
      businessRules: [
        'Aggregate all expected yields in village',
        'If villageSupply > 50000, set pressure = High'
      ],
      featureImportance: [],
      shapValues: []
    },
    {
      id: 'node-demand',
      engine: 'demand-intelligence',
      label: 'Demand Intelligence',
      iconType: 'shopping-cart',
      status: 'completed',
      executionTimeMs: 200,
      confidence: 81,
      inputs: { crop: 'Paddy', upcomingFestivals: ['Dussehra'], mspActive: true },
      outputs: { totalDemandKg: 7200, trend: 'Rising', festivalDemand: 1500 },
      businessRules: [
        'Apply 1.2x multiplier if festival within 14 days',
        'Add MSP procurement quota to baseline demand'
      ],
      featureImportance: [],
      shapValues: []
    },
    {
      id: 'node-market',
      engine: 'market-intelligence',
      label: 'Market Intelligence',
      iconType: 'bar-chart',
      status: 'completed',
      executionTimeMs: 310,
      confidence: 90,
      inputs: { supply: 'Medium', demand: 'Rising', historicalPrices: [23, 24, 24.5] },
      outputs: { expectedPrice: 26.0, bestMarket: 'Yeshwanthpur APMC', transportCost: 1200 },
      businessRules: [
        'If Demand > Supply && Trend == Rising, project price increase +5%',
        'Subtract transportCost to calculate net profit'
      ],
      recommendation: 'Hold for 3 days to capture rising festival price.',
      featureImportance: [],
      shapValues: []
    },
    {
      id: 'node-decision',
      engine: 'decision-engine',
      label: 'Final Decision',
      iconType: 'target',
      status: 'completed',
      executionTimeMs: 50,
      confidence: 88,
      inputs: { 
        harvestDelay: 3, 
        expectedYield: 5200, 
        priceProjection: 26.0 
      },
      outputs: { 
        action: 'Delay Harvest', 
        profitIncrease: '₹12,500' 
      },
      businessRules: [
        'Aggregate all module outputs',
        'Maximize (Yield * Price) - Costs',
        'Ensure WeatherRisk == Low at action date'
      ],
      featureImportance: [],
      shapValues: [
        { feature: 'Weather Forecast (Rain)', impact: 'positive', value: 0.45 },
        { feature: 'Market Price Trend', impact: 'positive', value: 0.30 },
        { feature: 'Festival Demand', impact: 'positive', value: 0.15 },
        { feature: 'Grain Moisture', impact: 'negative', value: 0.10 }
      ]
    }
  ],
  scenarios: [
    {
      id: 'scen-1',
      name: 'Harvest Today',
      expectedProfit: 122700,
      expectedYieldKg: 5200,
      marketPrice: 24.50,
      riskLevel: 'medium',
      recommendation: 'Not Recommended - High moisture content'
    },
    {
      id: 'scen-2',
      name: 'Harvest in 3 Days',
      expectedProfit: 135200,
      expectedYieldKg: 5200,
      marketPrice: 26.00,
      riskLevel: 'low',
      recommendation: 'Optimal - Best balance of price and quality'
    },
    {
      id: 'scen-3',
      name: 'Harvest in 7 Days',
      expectedProfit: 130000,
      expectedYieldKg: 5050,
      marketPrice: 26.50,
      riskLevel: 'high',
      recommendation: 'High Risk - Potential shattering loss'
    }
  ],
  timeline: [
    { id: 'tl-1', date: '2026-07-06', title: 'Apply Fertilizer', status: 'applied', description: 'Urea application completed' },
    { id: 'tl-2', date: '2026-07-07', title: 'Irrigation', status: 'rejected', description: 'Skipped due to forecasted rain' },
    { id: 'tl-3', date: '2026-07-08', title: 'Pest Scouting', status: 'accepted', description: 'No immediate threat detected' },
    { id: 'tl-4', date: '2026-07-11', title: 'Harvest Preparation', status: 'upcoming' }
  ]
};

export const aiService = {
  getDecisionIntelligence: async (_farmerCropId?: string): Promise<ExplainableDecisionData> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockExplainableData;
  }
};
