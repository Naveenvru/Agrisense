import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CropsService } from './crops.service';

@ApiTags('Crops Catalog')
@Controller('crops')
export class CropsController {
  constructor(private cropsService: CropsService) {}

  @ApiOperation({ summary: 'List and filter crops catalog' })
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('cropCategory') cropCategory?: string,
    @Query('season') season?: string,
  ) {
    const result = await this.cropsService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      cropCategory,
      season,
    });

    return {
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  @ApiOperation({ summary: 'Get specific crop details' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const crop = await this.cropsService.findOne(id);
    return { data: crop };
  }
}
