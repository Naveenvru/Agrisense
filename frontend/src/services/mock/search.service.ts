export interface SearchResult {
  type: string;
  iconType: string;
  text: string;
  desc: string;
  highlight?: boolean;
}

export const mockSearchResults: SearchResult[] = [
  { type: 'Farm', iconType: 'MapPin', text: 'Sunny Valley Farm', desc: 'Active • 10 Acres' },
  { type: 'Crop', iconType: 'Sprout', text: 'Tomato (Hybrid)', desc: 'Harvest in 12 days' },
  { type: 'Weather', iconType: 'Cloud', text: 'Rain Forecast', desc: 'Expected in 4 hours' },
  { type: 'Market', iconType: 'TrendingUp', text: 'Tomato Prices', desc: 'Currently ₹2,850/q' },
  { type: 'AI', iconType: 'Sparkles', text: 'Ask AgriSense AI', desc: '"How to treat early blight?"', highlight: true }
];

export const searchService = {
  search: async (query: string): Promise<SearchResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return mockSearchResults.filter(res => 
      res.text.toLowerCase().includes(lowerQuery) || 
      res.desc.toLowerCase().includes(lowerQuery) ||
      res.type.toLowerCase().includes(lowerQuery)
    );
  },
  getRecentSearches: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return ['Wheat harvest', 'Bengaluru APMC', 'Fertilizer cost'];
  }
};
