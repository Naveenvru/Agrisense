export interface ProfileData {
  farmerId: string;
  phone: string;
  language: string;
  location: string;
  registrationDate: string;
  subscription: string;
  totalFarms: number;
  totalArea: string;
  connectedAccounts: {
    google: boolean;
  };
  achievements: { id: string; title: string; desc: string; icon: string }[];
}

export const mockProfileData: ProfileData = {
  farmerId: 'AGRI-7732-901',
  phone: '+91 98765 43210',
  language: 'English (US)',
  location: 'Bangalore, Karnataka',
  registrationDate: 'October 15, 2023',
  subscription: 'AgriSense Pro',
  totalFarms: 3,
  totalArea: '45 Acres',
  connectedAccounts: {
    google: true,
  },
  achievements: [
    { id: '1', title: 'Early Adopter', desc: 'Joined during beta', icon: 'Star' },
    { id: '2', title: 'Water Saver', desc: 'Saved 10k L water', icon: 'Droplet' },
    { id: '3', title: 'Top Yield', desc: 'Top 10% yield in region', icon: 'TrendingUp' }
  ]
};

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockProfileData;
  }
};
