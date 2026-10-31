"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MarketQualityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketQualityService = void 0;
const common_1 = require("@nestjs/common");
let MarketQualityService = class MarketQualityService {
    static { MarketQualityService_1 = this; }
    logger = new common_1.Logger(MarketQualityService_1.name);
    static MAX_PRICE = 500_000;
    static MAX_DATE_AGE_DAYS = 3650;
    validate(records) {
        const seenKeys = new Set();
        const valid = [];
        const rejected = [];
        let duplicateCount = 0;
        for (const record of records) {
            const reasons = this.validateRecord(record);
            if (reasons.length > 0) {
                rejected.push({ record, reasons });
                this.logger.debug(`REJECTED | commodity=${record.commodity} market=${record.market} reasons=[${reasons.join(', ')}]`);
                continue;
            }
            const dedupKey = this.dedupKey(record);
            if (seenKeys.has(dedupKey)) {
                duplicateCount++;
                rejected.push({ record, reasons: ['Duplicate record in batch'] });
                this.logger.debug(`DUPLICATE | key=${dedupKey}`);
                continue;
            }
            seenKeys.add(dedupKey);
            valid.push(record);
        }
        this.logger.log(`Quality check | total=${records.length} valid=${valid.length} rejected=${rejected.length} duplicates=${duplicateCount}`);
        return {
            valid,
            rejected,
            totalInput: records.length,
            totalValid: valid.length,
            totalRejected: rejected.length,
            totalDuplicates: duplicateCount,
        };
    }
    validateRecord(record) {
        const reasons = [];
        if (!record.commodity?.trim()) {
            reasons.push('Missing commodity name');
        }
        if (!record.market?.trim()) {
            reasons.push('Missing market name');
        }
        if (!record.date) {
            reasons.push('Missing date');
        }
        if (!record.source?.trim()) {
            reasons.push('Missing source');
        }
        if (record.minPrice === undefined || record.minPrice === null) {
            reasons.push('Missing minPrice');
        }
        else if (record.minPrice < 0) {
            reasons.push(`Invalid minPrice: ${record.minPrice} (negative)`);
        }
        if (record.maxPrice === undefined || record.maxPrice === null) {
            reasons.push('Missing maxPrice');
        }
        else if (record.maxPrice < 0) {
            reasons.push(`Invalid maxPrice: ${record.maxPrice} (negative)`);
        }
        if (record.modalPrice === undefined || record.modalPrice === null) {
            reasons.push('Missing modalPrice');
        }
        else if (record.modalPrice < 0) {
            reasons.push(`Invalid modalPrice: ${record.modalPrice} (negative)`);
        }
        if (record.minPrice >= 0 &&
            record.maxPrice >= 0 &&
            record.minPrice > record.maxPrice) {
            reasons.push(`Price range invalid: minPrice (${record.minPrice}) > maxPrice (${record.maxPrice})`);
        }
        if (record.modalPrice > MarketQualityService_1.MAX_PRICE) {
            reasons.push(`modalPrice (${record.modalPrice}) exceeds maximum threshold (${MarketQualityService_1.MAX_PRICE})`);
        }
        if (record.date) {
            const date = new Date(record.date);
            const now = new Date();
            if (isNaN(date.getTime())) {
                reasons.push(`Invalid date format: ${record.date}`);
            }
            else if (date > now) {
                reasons.push(`Future date not allowed: ${date.toISOString()}`);
            }
            else {
                const ageDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                if (ageDays > MarketQualityService_1.MAX_DATE_AGE_DAYS) {
                    reasons.push(`Date too old: ${date.toISOString().slice(0, 10)} (>${MarketQualityService_1.MAX_DATE_AGE_DAYS} days)`);
                }
            }
        }
        if (record.arrivalQty !== undefined && record.arrivalQty < 0) {
            reasons.push(`Invalid arrivalQty: ${record.arrivalQty} (negative)`);
        }
        return reasons;
    }
    dedupKey(record) {
        const dateStr = new Date(record.date).toISOString().slice(0, 10);
        return [record.state, record.district, record.market, record.commodity, record.variety ?? '', record.grade ?? '', dateStr]
            .map((value) => String(value).toLowerCase().trim())
            .join('|');
    }
};
exports.MarketQualityService = MarketQualityService;
exports.MarketQualityService = MarketQualityService = MarketQualityService_1 = __decorate([
    (0, common_1.Injectable)()
], MarketQualityService);
//# sourceMappingURL=market-quality.service.js.map