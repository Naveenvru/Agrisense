import { apiClient } from '@/lib/axios';

export interface SearchResult {
  type: string;
  iconType: string;
  text: string;
  desc: string;
  highlight?: boolean;
}

export const searchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    if (!query) return [];
    
    let farmResults: SearchResult[] = [];
    try {
      const res = await apiClient.get('/land-parcels');
      const parcels = res.data?.data || [];
      farmResults = parcels.map((p: any) => ({
        type: 'Farm',
        iconType: 'MapPin',
        text: p.parcelName || `Parcel ${p.id}`,
        desc: `Active • ${p.areaAcres || 0} Acres • ${p.district || 'Registered Location'}`
      }));
    } catch (e) {}

    const catalogResults: SearchResult[] = [
      { type: 'Crop', iconType: 'Sprout', text: 'Tomato (Hybrid)', desc: 'Harvest tracking' },
      { type: 'Weather', iconType: 'Cloud', text: 'Rain Forecast', desc: 'Hyper-local IMD updates' },
      { type: 'Market', iconType: 'TrendingUp', text: 'APMC Market Prices', desc: 'Real-time Mandi rates' },
      { type: 'AI', iconType: 'Sparkles', text: 'Ask AgriSense AI', desc: '"How to treat early blight?"', highlight: true }
    ];

    const combined = [...farmResults, ...catalogResults];
    const lowerQuery = query.toLowerCase();
    return combined.filter(res => 
      res.text.toLowerCase().includes(lowerQuery) || 
      res.desc.toLowerCase().includes(lowerQuery) ||
      res.type.toLowerCase().includes(lowerQuery)
    );
  },
  getRecentSearches: async (): Promise<string[]> => {
    return ['Tomato harvest', 'Bengaluru APMC', 'Fertilizer cost'];
  }
};
