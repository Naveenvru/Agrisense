export const MOCK_FARM_DATA = {
  fields: [
    { id: 1, name: "Field A", area: 45, crop: "Wheat", status: "Healthy", moisture: 65, ph: 6.8 },
    { id: 2, name: "Field B", area: 30, crop: "Corn", status: "Attention Required", moisture: 42, ph: 6.2 },
    { id: 3, name: "Field C", area: 45, crop: "Soybeans", status: "Healthy", moisture: 58, ph: 6.5 },
  ],
  inventory: [
    { item: "Nitrogen Fertilizer", quantity: "450 kg", status: "Good" },
    { item: "Pesticide Alpha", quantity: "20 L", status: "Low" },
    { item: "Wheat Seeds", quantity: "1200 kg", status: "Good" }
  ]
};
