import { Injectable } from '@nestjs/common';
import type { IHarvestLifecycleEngine } from '../interfaces/harvest-lifecycle.interface';
import type { LifecycleContext, LifecycleStage } from '../interfaces/harvest-intelligence.types';

/**
 * CropLifecycleEngine
 *
 * Rule-based implementation of IHarvestLifecycleEngine.
 * Computes crop growth stage from sowing date and crop master duration.
 *
 * Reusable by: Harvest Intelligence, Yield Intelligence (Phase 12),
 *              Supply Intelligence (Phase 13), Disease Intelligence.
 *
 * Stage boundaries (percentage of durationDays elapsed):
 *   0%        → pre-sowing (sowing in future)
 *   0–15%     → seedling
 *   15–50%    → vegetative
 *   50–80%    → reproductive
 *   80–100%   → ripening
 *   100%      → ready
 *   >105%     → overdue
 *   (HARVESTED status handled externally)
 */
@Injectable()
export class CropLifecycleEngine implements IHarvestLifecycleEngine {
  compute(
    sowingDate: Date,
    durationDays: number,
    expectedHarvestDate: Date | null,
  ): LifecycleContext {
    const now = new Date();
    const sowingMs = new Date(sowingDate).getTime();
    const daysElapsed = Math.max(0, Math.floor((now.getTime() - sowingMs) / 86_400_000));

    // Effective duration: prefer Crop.durationDays, fall back to
    // difference between expectedHarvestDate and sowingDate if set.
    let effectiveDuration = durationDays;
    if (!effectiveDuration && expectedHarvestDate) {
      effectiveDuration = Math.max(
        1,
        Math.ceil(
          (new Date(expectedHarvestDate).getTime() - sowingMs) / 86_400_000,
        ),
      );
    }
    if (!effectiveDuration) effectiveDuration = 90; // safe default

    const daysRemaining = Math.max(0, effectiveDuration - daysElapsed);
    const growthPercentage = Math.min(
      110, // cap at 110% to show overdue
      Math.round((daysElapsed / effectiveDuration) * 100),
    );

    // Compute expected harvest date from sowing + duration if not manually set
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

  private resolveStage(pct: number): LifecycleStage {
    if (pct <= 0) return 'pre-sowing';
    if (pct < 15) return 'seedling';
    if (pct < 50) return 'vegetative';
    if (pct < 80) return 'reproductive';
    if (pct < 100) return 'ripening';
    if (pct < 106) return 'ready';
    return 'overdue';
  }
}
