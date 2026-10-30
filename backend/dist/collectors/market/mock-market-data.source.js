"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MockMarketDataSource_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMarketDataSource = void 0;
const common_1 = require("@nestjs/common");
let MockMarketDataSource = class MockMarketDataSource {
    static { MockMarketDataSource_1 = this; }
    sourceName = 'development_mock';
    static SAMPLE_DATA = [
        { commodity: 'Rice', variety: 'Sona Masuri', market: 'Bengaluru APMC', district: 'Bengaluru Urban', state: 'Karnataka', unit: 'Quintal', minPrice: 2200, maxPrice: 2600, modalPrice: 2400, arrivalQty: 1200 },
        { commodity: 'Wheat', variety: 'Lokwan', market: 'Delhi Azadpur', district: 'North Delhi', state: 'Delhi', unit: 'Quintal', minPrice: 2100, maxPrice: 2400, modalPrice: 2250, arrivalQty: 850 },
        { commodity: 'Tomato', variety: 'Hybrid', market: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', unit: 'Quintal', minPrice: 600, maxPrice: 1200, modalPrice: 900, arrivalQty: 4500 },
        { commodity: 'Onion', variety: 'Red', market: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', unit: 'Quintal', minPrice: 800, maxPrice: 1600, modalPrice: 1200, arrivalQty: 6200 },
        { commodity: 'Potato', variety: 'Kufri Pukhraj', market: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', unit: 'Quintal', minPrice: 500, maxPrice: 900, modalPrice: 700, arrivalQty: 3100 },
        { commodity: 'Maize', variety: 'Hybrid', market: 'Gulbarga APMC', district: 'Kalaburagi', state: 'Karnataka', unit: 'Quintal', minPrice: 1800, maxPrice: 2100, modalPrice: 1950, arrivalQty: 2200 },
        { commodity: 'Tur Dal', variety: 'Local', market: 'Latur APMC', district: 'Latur', state: 'Maharashtra', unit: 'Quintal', minPrice: 6200, maxPrice: 7000, modalPrice: 6600, arrivalQty: 780 },
        { commodity: 'Soyabean', variety: 'Yellow', market: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', unit: 'Quintal', minPrice: 4400, maxPrice: 5200, modalPrice: 4800, arrivalQty: 1560 },
    ];
    async fetchPrices(params) {
        const batchId = `mock_${Date.now()}`;
        const collectedAt = new Date();
        const priceDate = params.date ?? new Date();
        let data = MockMarketDataSource_1.SAMPLE_DATA;
        if (params.commodity) {
            const q = params.commodity.toLowerCase();
            data = data.filter((d) => d.commodity.toLowerCase().includes(q));
        }
        if (params.market) {
            const q = params.market.toLowerCase();
            data = data.filter((d) => d.market.toLowerCase().includes(q));
        }
        if (params.state) {
            const q = params.state.toLowerCase();
            data = data.filter((d) => d.state.toLowerCase().includes(q));
        }
        if (params.limit) {
            data = data.slice(0, params.limit);
        }
        return data.map((d) => ({
            commodity: d.commodity,
            variety: d.variety,
            market: d.market,
            district: d.district,
            state: d.state,
            date: priceDate,
            minPrice: this.vary(d.minPrice),
            maxPrice: this.vary(d.maxPrice),
            modalPrice: this.vary(d.modalPrice),
            arrivalQty: this.vary(d.arrivalQty),
            unit: d.unit,
            source: this.sourceName,
            rawPayload: JSON.stringify(d),
            collectedAt,
            batchId,
        }));
    }
    async isAvailable() {
        return true;
    }
    vary(value) {
        const factor = 0.95 + Math.random() * 0.1;
        return Math.round(value * factor);
    }
};
exports.MockMarketDataSource = MockMarketDataSource;
exports.MockMarketDataSource = MockMarketDataSource = MockMarketDataSource_1 = __decorate([
    (0, common_1.Injectable)()
], MockMarketDataSource);
//# sourceMappingURL=mock-market-data.source.js.map