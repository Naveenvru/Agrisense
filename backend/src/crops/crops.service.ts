import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './crop.entity';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private cropsRepository: Repository<Crop>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    cropCategory?: string;
    season?: string;
  }): Promise<{ data: Crop[]; total: number; page: number; limit: number }> {
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

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findOne({ where: { id } });
    if (!crop) {
      throw new NotFoundException('Crop not found');
    }
    return crop;
  }
}
