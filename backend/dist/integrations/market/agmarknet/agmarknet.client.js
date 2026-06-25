"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgmarknetClient = void 0;
const integration_constants_1 = require("../../common/integration.constants");
class AgmarknetClient {
    async fetch(_params) {
        throw new Error('AgmarknetClient: not yet implemented (Phase 9).');
    }
    async authenticate() {
    }
    async health() {
        return {
            provider: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
            healthy: false,
            message: 'AgmarknetClient is not yet implemented (Phase 9).',
            checkedAt: new Date(),
        };
    }
    async fetchPrices(_crop, _market, _date) {
        throw new Error('AgmarknetClient.fetchPrices: not yet implemented (Phase 9).');
    }
}
exports.AgmarknetClient = AgmarknetClient;
//# sourceMappingURL=agmarknet.client.js.map