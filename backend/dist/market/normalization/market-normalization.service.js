"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MarketNormalizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketNormalizationService = void 0;
const common_1 = require("@nestjs/common");
const integration_constants_1 = require("../../integrations/common/integration.constants");
let MarketNormalizationService = MarketNormalizationService_1 = class MarketNormalizationService {
    logger = new common_1.Logger(MarketNormalizationService_1.name);
    commodityMap = new Map([
        ['paddy', 'Rice'],
        ['rice', 'Rice'],
        ['chawal', 'Rice'],
        ['wheat', 'Wheat'],
        ['gehun', 'Wheat'],
        ['maize', 'Maize'],
        ['corn', 'Maize'],
        ['makka', 'Maize'],
        ['jowar', 'Sorghum'],
        ['bajra', 'Pearl Millet'],
        ['ragi', 'Finger Millet'],
        ['tomato', 'Tomato'],
        ['tamatar', 'Tomato'],
        ['onion', 'Onion'],
        ['pyaaz', 'Onion'],
        ['kanda', 'Onion'],
        ['potato', 'Potato'],
        ['aloo', 'Potato'],
        ['arhar', 'Tur Dal'],
        ['tur', 'Tur Dal'],
        ['tur dal', 'Tur Dal'],
        ['moong', 'Moong Dal'],
        ['moong dal', 'Moong Dal'],
        ['urad', 'Urad Dal'],
        ['urad dal', 'Urad Dal'],
        ['masoor', 'Masoor Dal'],
        ['soyabean', 'Soyabean'],
        ['soybean', 'Soyabean'],
        ['groundnut', 'Groundnut'],
        ['mungfali', 'Groundnut'],
        ['cotton', 'Cotton'],
        ['kapas', 'Cotton'],
        ['sugarcane', 'Sugarcane'],
        ['ganna', 'Sugarcane'],
        ['banana', 'Banana'],
        ['kela', 'Banana'],
    ]);
    marketMap = new Map([
        ['bengaluru apmc', 'Bengaluru APMC'],
        ['bangalore apmc', 'Bengaluru APMC'],
        ['bengaluru', 'Bengaluru APMC'],
        ['delhi azadpur', 'Delhi Azadpur Mandi'],
        ['azadpur', 'Delhi Azadpur Mandi'],
        ['azadpur mandi', 'Delhi Azadpur Mandi'],
        ['nashik apmc', 'Nashik APMC'],
        ['nashik', 'Nashik APMC'],
        ['agra mandi', 'Agra Mandi'],
        ['agra', 'Agra Mandi'],
        ['gulbarga apmc', 'Kalaburagi APMC'],
        ['kalaburagi apmc', 'Kalaburagi APMC'],
        ['latur apmc', 'Latur APMC'],
        ['latur', 'Latur APMC'],
        ['indore mandi', 'Indore Mandi'],
        ['indore', 'Indore Mandi'],
        ['ahmedabad apmc', 'Ahmedabad APMC'],
        ['ahmedabad', 'Ahmedabad APMC'],
        ['hyderabad market', 'Hyderabad Market'],
        ['hyderabad', 'Hyderabad Market'],
        ['chennai koyambedu', 'Chennai Koyambedu Market'],
        ['koyambedu', 'Chennai Koyambedu Market'],
    ]);
    unitMap = new Map([
        ['qtl', 'Quintal'],
        ['quintal', 'Quintal'],
        ['q', 'Quintal'],
        ['kg', 'Kilogram'],
        ['kilogram', 'Kilogram'],
        ['kilograms', 'Kilogram'],
        ['ton', 'Tonne'],
        ['tonne', 'Tonne'],
        ['mt', 'Tonne'],
        ['metric ton', 'Tonne'],
        ['gm', 'Gram'],
        ['gram', 'Gram'],
        ['grams', 'Gram'],
        ['bag', 'Bag'],
        ['bags', 'Bag'],
        ['bale', 'Bale'],
        ['bales', 'Bale'],
        ['piece', 'Piece'],
        ['pieces', 'Piece'],
        ['dozen', 'Dozen'],
    ]);
    normalizeBatch(rawRecords) {
        const prices = [];
        const arrivals = [];
        const now = new Date();
        const sorted = [...rawRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        for (const raw of sorted) {
            const price = this.normalizeToPrice(raw, now);
            if (price)
                prices.push(price);
            const arrival = this.normalizeToArrival(raw);
            if (arrival)
                arrivals.push(arrival);
        }
        this.logger.log(`Normalized ${rawRecords.length} raw records → ${prices.length} prices, ${arrivals.length} arrivals`);
        return { prices, arrivals };
    }
    normalizeRecord(input) {
        return {
            commodity: this.normalizeCommodity(input.commodity),
            market: this.normalizeMarket(input.market),
            district: input.district,
            state: input.state,
            date: this.normalizeDate(input.date),
            minPrice: this.normalizePrice(input.minPrice),
            maxPrice: this.normalizePrice(input.maxPrice),
            modalPrice: this.normalizePrice(input.modalPrice),
            unit: this.normalizeUnit(input.unit),
            source: input.source,
            normalizedAt: new Date(),
            qualityScore: 100,
        };
    }
    normalizeCommodity(raw) {
        const key = raw.toLowerCase().trim();
        return this.commodityMap.get(key) ?? this.toTitleCase(raw);
    }
    normalizeMarket(raw) {
        const key = raw.toLowerCase().trim();
        return this.marketMap.get(key) ?? this.toTitleCase(raw);
    }
    normalizeUnit(raw) {
        const key = raw.toLowerCase().trim();
        return this.unitMap.get(key) ?? 'Quintal';
    }
    normalizeDate(raw) {
        const d = raw instanceof Date ? raw : new Date(raw);
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    normalizePrice(raw) {
        const val = Number(raw);
        return isNaN(val) || val < 0 ? 0 : Math.round(val * 100) / 100;
    }
    normalizeToPrice(raw, normalizedAt) {
        return {
            commodity: this.normalizeCommodity(raw.commodity),
            market: this.normalizeMarket(raw.market),
            district: raw.district,
            state: raw.state,
            date: this.normalizeDate(raw.date),
            minPrice: this.normalizePrice(raw.minPrice),
            maxPrice: this.normalizePrice(raw.maxPrice),
            modalPrice: this.normalizePrice(raw.modalPrice),
            unit: this.normalizeUnit(raw.unit),
            source: raw.source ?? integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
            normalizedAt,
            qualityScore: 100,
        };
    }
    normalizeToArrival(raw) {
        return {
            commodity: this.normalizeCommodity(raw.commodity),
            market: this.normalizeMarket(raw.market),
            district: raw.district,
            state: raw.state,
            date: this.normalizeDate(raw.date),
            arrivalQty: Math.max(0, raw.arrivalQty),
            unit: this.normalizeUnit(raw.unit),
            source: raw.source ?? integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
        };
    }
    toTitleCase(s) {
        return s
            .toLowerCase()
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
};
exports.MarketNormalizationService = MarketNormalizationService;
exports.MarketNormalizationService = MarketNormalizationService = MarketNormalizationService_1 = __decorate([
    (0, common_1.Injectable)()
], MarketNormalizationService);
//# sourceMappingURL=market-normalization.service.js.map