export interface SettingsData {
  appearance: {
    darkMode: boolean;
    highContrast: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weatherAlerts: boolean;
    marketUpdates: boolean;
  };
  aiPreferences: {
    autoSuggest: boolean;
    voiceEnabled: boolean;
  };
}

export const mockSettingsData: SettingsData = {
  appearance: {
    darkMode: true,
    highContrast: false,
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    weatherAlerts: true,
    marketUpdates: true,
  },
  aiPreferences: {
    autoSuggest: true,
    voiceEnabled: false,
  }
};

export const settingsService = {
  getSettings: async (): Promise<SettingsData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSettingsData;
  }
};
