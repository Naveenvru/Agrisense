"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropLifecycleEngine = void 0;
const common_1 = require("@nestjs/common");
let CropLifecycleEngine = class CropLifecycleEngine {
    compute(sowingDate, durationDays, expectedHarvestDate) {
        const now = new Date();
        const sowingMs = new Date(sowingDate).getTime();
        const daysElapsed = Math.max(0, Math.floor((now.getTime() - sowingMs) / 86_400_000));
        let effectiveDuration = durationDays;
        if (!effectiveDuration && expectedHarvestDate) {
            effectiveDuration = Math.max(1, Math.ceil((new Date(expectedHarvestDate).getTime() - sowingMs) / 86_400_000));
        }
        if (!effectiveDuration)
            effectiveDuration = 90;
        const daysRemaining = Math.max(0, effectiveDuration - daysElapsed);
        const growthPercentage = Math.min(110, Math.round((daysElapsed / effectiveDuration) * 100));
        const computedHarvestDate = expectedHarvestDate
            ? new Date(expectedHarvestDate)
            : new Date(sowingMs + effectiveDuration * 86_400_000);
        return {
            sowingDate: new Date(sowingDate),
            durationDays: effectiveDuration,
            expectedHarvestDate: computedHarvestDate,
            daysElapsed,
            daysRemaining,
            growthPercentage,
            lifecycleStage: this.resolveStage(growthPercentage),
        };
    }
    resolveStage(pct) {
        if (pct <= 0)
            return 'pre-sowing';
        if (pct < 15)
            return 'seedling';
        if (pct < 50)
            return 'vegetative';
        if (pct < 80)
            return 'reproductive';
        if (pct < 100)
            return 'ripening';
        if (pct < 106)
            return 'ready';
        return 'overdue';
    }
};
exports.CropLifecycleEngine = CropLifecycleEngine;
exports.CropLifecycleEngine = CropLifecycleEngine = __decorate([
    (0, common_1.Injectable)()
], CropLifecycleEngine);
//# sourceMappingURL=crop-lifecycle.engine.js.map