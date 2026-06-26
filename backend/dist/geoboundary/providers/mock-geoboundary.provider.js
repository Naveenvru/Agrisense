"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MockGeoBoundaryProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGeoBoundaryProvider = void 0;
const common_1 = require("@nestjs/common");
let MockGeoBoundaryProvider = MockGeoBoundaryProvider_1 = class MockGeoBoundaryProvider {
    logger = new common_1.Logger(MockGeoBoundaryProvider_1.name);
    async reverseGeocode(latitude, longitude) {
        this.logger.debug(`Mocking reverse geocode for ${latitude}, ${longitude}`);
        return {
            villageName: 'Sample Village',
            talukName: 'Sample Taluk',
            districtName: 'Bengaluru Urban',
            stateName: 'Karnataka',
            countryName: 'India',
            postalCode: '560001',
            provider: 'mock',
        };
    }
};
exports.MockGeoBoundaryProvider = MockGeoBoundaryProvider;
exports.MockGeoBoundaryProvider = MockGeoBoundaryProvider = MockGeoBoundaryProvider_1 = __decorate([
    (0, common_1.Injectable)()
], MockGeoBoundaryProvider);
//# sourceMappingURL=mock-geoboundary.provider.js.map