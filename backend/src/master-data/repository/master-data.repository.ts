import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  State, District, Taluk, Village, Mandi, Commodity, CropVariety,
  Season, SoilType, IrrigationType, Fertilizer, Pesticide
} from '../../mongodb/master-data/master-data.schema';

@Injectable()
export class MasterDataRepository {
  private readonly logger = new Logger(MasterDataRepository.name);

  constructor(
    @InjectModel(State.name) private readonly stateModel: Model<State>,
    @InjectModel(District.name) private readonly districtModel: Model<District>,
    @InjectModel(Taluk.name) private readonly talukModel: Model<Taluk>,
    @InjectModel(Village.name) private readonly villageModel: Model<Village>,
    @InjectModel(Mandi.name) private readonly mandiModel: Model<Mandi>,
    @InjectModel(Commodity.name) private readonly commodityModel: Model<Commodity>,
    @InjectModel(CropVariety.name) private readonly cropVarietyModel: Model<CropVariety>,
    @InjectModel(Season.name) private readonly seasonModel: Model<Season>,
    @InjectModel(SoilType.name) private readonly soilTypeModel: Model<SoilType>,
    @InjectModel(IrrigationType.name) private readonly irrigationTypeModel: Model<IrrigationType>,
    @InjectModel(Fertilizer.name) private readonly fertilizerModel: Model<Fertilizer>,
    @InjectModel(Pesticide.name) private readonly pesticideModel: Model<Pesticide>,
  ) {}

  // ---------------------------------------------------------------------------
  // Generic Find Methods
  // ---------------------------------------------------------------------------

  async findStates(query: Record<string, any> = {}): Promise<State[]> {
    return this.stateModel.find(query).sort({ name: 1 }).exec();
  }

  async findDistricts(query: Record<string, any> = {}): Promise<District[]> {
    return this.districtModel.find(query).sort({ name: 1 }).exec();
  }

  async findTaluks(query: Record<string, any> = {}): Promise<Taluk[]> {
    return this.talukModel.find(query).sort({ name: 1 }).exec();
  }

  async findVillages(query: Record<string, any> = {}): Promise<Village[]> {
    return this.villageModel.find(query).sort({ name: 1 }).exec();
  }

  async findMandis(query: Record<string, any> = {}): Promise<Mandi[]> {
    return this.mandiModel.find(query).sort({ name: 1 }).exec();
  }

  async findCommodities(query: Record<string, any> = {}): Promise<Commodity[]> {
    return this.commodityModel.find(query).sort({ name: 1 }).exec();
  }

  async findCropVarieties(query: Record<string, any> = {}): Promise<CropVariety[]> {
    return this.cropVarietyModel.find(query).sort({ name: 1 }).exec();
  }

  async findSeasons(query: Record<string, any> = {}): Promise<Season[]> {
    return this.seasonModel.find(query).sort({ name: 1 }).exec();
  }

  async findSoilTypes(query: Record<string, any> = {}): Promise<SoilType[]> {
    return this.soilTypeModel.find(query).sort({ name: 1 }).exec();
  }

  async findIrrigationTypes(query: Record<string, any> = {}): Promise<IrrigationType[]> {
    return this.irrigationTypeModel.find(query).sort({ name: 1 }).exec();
  }

  async findFertilizers(query: Record<string, any> = {}): Promise<Fertilizer[]> {
    return this.fertilizerModel.find(query).sort({ name: 1 }).exec();
  }

  async findPesticides(query: Record<string, any> = {}): Promise<Pesticide[]> {
    return this.pesticideModel.find(query).sort({ name: 1 }).exec();
  }

  // ---------------------------------------------------------------------------
  // Save Methods (Bulk Upsert for Import)
  // ---------------------------------------------------------------------------

  async upsertStates(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.stateModel.bulkWrite(ops);
  }

  async upsertDistricts(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name, stateId: d.stateId }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.districtModel.bulkWrite(ops);
  }

  async upsertTaluks(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name, districtId: d.districtId }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.talukModel.bulkWrite(ops);
  }

  async upsertVillages(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name, talukId: d.talukId }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.villageModel.bulkWrite(ops);
  }

  async upsertMandis(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name, districtId: d.districtId }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.mandiModel.bulkWrite(ops);
  }

  async upsertCommodities(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.commodityModel.bulkWrite(ops);
  }

  async upsertCropVarieties(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name, commodityId: d.commodityId }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.cropVarietyModel.bulkWrite(ops);
  }

  async upsertSeasons(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.seasonModel.bulkWrite(ops);
  }

  async upsertSoilTypes(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.soilTypeModel.bulkWrite(ops);
  }

  async upsertIrrigationTypes(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.irrigationTypeModel.bulkWrite(ops);
  }

  async upsertFertilizers(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.fertilizerModel.bulkWrite(ops);
  }

  async upsertPesticides(data: any[]): Promise<void> {
    const ops = data.map((d) => ({
      updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
    }));
    if (ops.length) await this.pesticideModel.bulkWrite(ops);
  }

  // ---------------------------------------------------------------------------
  // Access to models for advanced aggregations (e.g. Trie)
  // ---------------------------------------------------------------------------
  getCommodityModel(): Model<Commodity> { return this.commodityModel; }
  getDistrictModel(): Model<District> { return this.districtModel; }
  getMandiModel(): Model<Mandi> { return this.mandiModel; }
}
