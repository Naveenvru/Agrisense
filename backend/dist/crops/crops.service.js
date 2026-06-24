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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crop_entity_1 = require("./crop.entity");
let CropsService = class CropsService {
    cropsRepository;
    constructor(cropsRepository) {
        this.cropsRepository = cropsRepository;
    }
    async findAll(query) {
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;
        const skip = (page - 1) * limit;
        const qb = this.cropsRepository.createQueryBuilder('crop');
        if (query.search) {
            qb.andWhere('crop.crop_name ILIKE :search', {
                search: `%${query.search}%`,
            });
        }
        if (query.cropCategory) {
            qb.andWhere('crop.crop_category = :cropCategory', {
                cropCategory: query.cropCategory,
            });
        }
        if (query.season) {
            qb.andWhere('crop.season = :season', {
                season: query.season,
            });
        }
        qb.orderBy('crop.crop_name', 'ASC');
        qb.skip(skip).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const crop = await this.cropsRepository.findOne({ where: { id } });
        if (!crop) {
            throw new common_1.NotFoundException('Crop not found');
        }
        return crop;
    }
};
exports.CropsService = CropsService;
exports.CropsService = CropsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(crop_entity_1.Crop)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CropsService);
//# sourceMappingURL=crops.service.js.map