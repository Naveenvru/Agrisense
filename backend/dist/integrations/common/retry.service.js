"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RetryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryService = void 0;
const common_1 = require("@nestjs/common");
const integration_constants_1 = require("./integration.constants");
let RetryService = RetryService_1 = class RetryService {
    logger = new common_1.Logger(RetryService_1.name);
    async execute(operation, context, config) {
        const maxRetries = config?.maxRetries ?? integration_constants_1.INTEGRATION_CONSTANTS.DEFAULT_MAX_RETRIES;
        const baseDelayMs = config?.baseDelayMs ?? integration_constants_1.INTEGRATION_CONSTANTS.DEFAULT_RETRY_DELAY_MS;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                const isLastAttempt = attempt === maxRetries;
                if (isLastAttempt) {
                    this.logger.error(`[${context}] All ${maxRetries} attempts failed. Last error: ${error?.message}`);
                    throw error;
                }
                const jitter = 0.8 + Math.random() * 0.4;
                const delay = Math.round(baseDelayMs * Math.pow(2, attempt - 1) * jitter);
                this.logger.warn(`[${context}] Attempt ${attempt}/${maxRetries} failed: ${error?.message}. Retrying in ${delay}ms...`);
                await this.sleep(delay);
            }
        }
        throw lastError ?? new Error(`[${context}] Retry exhausted with no captured error.`);
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.RetryService = RetryService;
exports.RetryService = RetryService = RetryService_1 = __decorate([
    (0, common_1.Injectable)()
], RetryService);
//# sourceMappingURL=retry.service.js.map