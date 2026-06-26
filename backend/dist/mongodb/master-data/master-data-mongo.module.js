"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataMongoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const master_data_schema_1 = require("./master-data.schema");
let MasterDataMongoModule = class MasterDataMongoModule {
};
exports.MasterDataMongoModule = MasterDataMongoModule;
exports.MasterDataMongoModule = MasterDataMongoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: master_data_schema_1.State.name, schema: master_data_schema_1.StateSchema },
                { name: master_data_schema_1.District.name, schema: master_data_schema_1.DistrictSchema },
                { name: master_data_schema_1.Taluk.name, schema: master_data_schema_1.TalukSchema },
                { name: master_data_schema_1.Village.name, schema: master_data_schema_1.VillageSchema },
                { name: master_data_schema_1.Mandi.name, schema: master_data_schema_1.MandiSchema },
                { name: master_data_schema_1.Commodity.name, schema: master_data_schema_1.CommoditySchema },
                { name: master_data_schema_1.CropVariety.name, schema: master_data_schema_1.CropVarietySchema },
                { name: master_data_schema_1.Season.name, schema: master_data_schema_1.SeasonSchema },
                { name: master_data_schema_1.SoilType.name, schema: master_data_schema_1.SoilTypeSchema },
                { name: master_data_schema_1.IrrigationType.name, schema: master_data_schema_1.IrrigationTypeSchema },
                { name: master_data_schema_1.Fertilizer.name, schema: master_data_schema_1.FertilizerSchema },
                { name: master_data_schema_1.Pesticide.name, schema: master_data_schema_1.PesticideSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], MasterDataMongoModule);
//# sourceMappingURL=master-data-mongo.module.js.map