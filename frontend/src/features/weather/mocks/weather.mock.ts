export const MOCK_WEATHER_DATA = {
  current: {
    temp: 24,
    condition: "Partly Cloudy",
    humidity: 60,
    wind: 12,
    precipitation: 0,
    uvIndex: 4,
    pressure: 1012,
    visibility: 10
  },
  forecast: [
    { time: "08:00", temp: 18, condition: "Sunny" },
    { time: "12:00", temp: 24, condition: "Partly Cloudy" },
    { time: "16:00", temp: 26, condition: "Sunny" },
    { time: "20:00", temp: 20, condition: "Clear" }
  ],
  weekly: [
    { day: "Mon", min: 16, max: 25, condition: "Sunny", rainChance: 10 },
    { day: "Tue", min: 15, max: 22, condition: "Rain", rainChance: 80 },
    { day: "Wed", min: 17, max: 26, condition: "Sunny", rainChance: 0 },
    { day: "Thu", min: 18, max: 27, condition: "Partly Cloudy", rainChance: 20 },
    { day: "Fri", min: 19, max: 28, condition: "Sunny", rainChance: 5 }
  ]
};
