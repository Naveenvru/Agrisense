"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BaseHttpClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpClient = void 0;
const common_1 = require("@nestjs/common");
const integration_constants_1 = require("./integration.constants");
const retry_service_1 = require("./retry.service");
let BaseHttpClient = BaseHttpClient_1 = class BaseHttpClient {
    retryService;
    logger = new common_1.Logger(BaseHttpClient_1.name);
    constructor(retryService) {
        this.retryService = retryService;
    }
    async get(url, options, retryConfig) {
        return this.request({ url, method: 'GET', ...options }, retryConfig);
    }
    async post(url, body, options, retryConfig) {
        return this.request({ url, method: 'POST', body, ...options }, retryConfig);
    }
    async put(url, body, options, retryConfig) {
        return this.request({ url, method: 'PUT', body, ...options }, retryConfig);
    }
    async delete(url, options, retryConfig) {
        return this.request({ url, method: 'DELETE', ...options }, retryConfig);
    }
    async request(config, retryConfig) {
        const method = config.method ?? 'GET';
        const fullUrl = this.buildUrl(config.url, config.params);
        const timeoutMs = config.timeoutMs ?? integration_constants_1.INTEGRATION_CONSTANTS.DEFAULT_TIMEOUT_MS;
        const context = `${method} ${fullUrl}`;
        return this.retryService.execute(() => this.executeRequest(fullUrl, method, config, timeoutMs), context, retryConfig);
    }
    async executeRequest(url, method, config, timeoutMs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const startTime = Date.now();
        this.logger.log(`→ ${method} ${url}`);
        try {
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...config.headers,
            };
            const fetchOptions = {
                method,
                headers,
                signal: controller.signal,
            };
            if (config.body && method !== 'GET' && method !== 'DELETE') {
                fetchOptions.body = JSON.stringify(config.body);
            }
            const response = await fetch(url, fetchOptions);
            const durationMs = Date.now() - startTime;
            this.logger.log(`← ${response.status} ${method} ${url} (${durationMs}ms)`);
            if (!response.ok) {
                const errorBody = await response.text();
                this.logger.error(`HTTP ${response.status} from ${url}: ${errorBody}`);
                throw new common_1.ServiceUnavailableException(`External service returned HTTP ${response.status}`);
            }
            const data = (await response.json());
            const responseHeaders = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            return { data, status: response.status, headers: responseHeaders, durationMs };
        }
        catch (error) {
            const durationMs = Date.now() - startTime;
            if (error?.name === 'AbortError') {
                this.logger.error(`Timeout after ${durationMs}ms: ${method} ${url}`);
                throw new common_1.ServiceUnavailableException(`Request timed out after ${timeoutMs}ms`);
            }
            if (error instanceof common_1.ServiceUnavailableException) {
                throw error;
            }
            this.logger.error(`Unexpected error on ${method} ${url}: ${error?.message}`);
            throw new common_1.ServiceUnavailableException(`Failed to communicate with external service: ${error?.message}`);
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    buildUrl(base, params) {
        if (!params || Object.keys(params).length === 0)
            return base;
        const qs = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&');
        return `${base}?${qs}`;
    }
};
exports.BaseHttpClient = BaseHttpClient;
exports.BaseHttpClient = BaseHttpClient = BaseHttpClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [retry_service_1.RetryService])
], BaseHttpClient);
//# sourceMappingURL=base-http.client.js.map