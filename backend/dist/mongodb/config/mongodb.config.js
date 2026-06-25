"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mongodb', () => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisense_mongo',
    database: process.env.MONGODB_DATABASE || 'agrisense_mongo',
}));
//# sourceMappingURL=mongodb.config.js.map