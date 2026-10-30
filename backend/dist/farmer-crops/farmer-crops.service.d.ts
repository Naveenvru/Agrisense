import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { FarmerCrop } from './farmer-crop.entity';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { CropCondition, CropConditionDocument } from './crop-condition.schema';
import { CreateCropConditionDto } from './dto/create-crop-condition.dto';
import { CalendarEvent } from '../calendar/calendar-event.entity';
import { CropCalendarTemplate } from '../calendar/crop-calendar-template.entity';
import { UserSettings } from '../settings/user-settings.entity';
export declare class FarmerCropsService {
    private farmerCropsRepository;
    private calendarEventsRepository;
    private calendarTemplatesRepository;
    private landParcelsRepository;
    private cropsRepository;
    private farmerProfilesRepository;
    private userSettingsRepository;
    private conditionsModel;
    private readonly configService;
    private readonly logger;
    constructor(farmerCropsRepository: Repository<FarmerCrop>, calendarEventsRepository: Repository<CalendarEvent>, calendarTemplatesRepository: Repository<CropCalendarTemplate>, landParcelsRepository: Repository<LandParcel>, cropsRepository: Repository<Crop>, farmerProfilesRepository: Repository<FarmerProfile>, userSettingsRepository: Repository<UserSettings>, conditionsModel: Model<CropCondition>, configService: ConfigService);
    private verifyParcelOwnership;
    private verifyFarmerCropOwnership;
    create(userId: string, createDto: CreateFarmerCropDto): Promise<{
        crop: FarmerCrop;
        calendarCount: number;
        calendarError?: string;
    }>;
    private createCalendarFromTemplates;
    private generateAiCalendarTasks;
    private saveAiCalendarTasks;
    private refreshAiCalendarForCondition;
    regenerateCalendar(farmerCropId: string, userId: string): Promise<{
        taskCount: number;
        source: string;
        updated: boolean;
        warning?: string;
        generatedTaskCount?: number;
    }>;
    findConditions(farmerCropId: string, userId: string): Promise<CropConditionDocument[]>;
    findConditionsForCycles(userId: string, farmerCropIds: string[]): Promise<CropConditionDocument[]>;
    createCondition(farmerCropId: string, userId: string, dto: CreateCropConditionDto): Promise<{
        observation: CropConditionDocument;
        calendarUpdated: boolean;
        calendarWarning?: string;
    }>;
    findAll(userId: string): Promise<FarmerCrop[]>;
    findOne(id: string, userId: string): Promise<FarmerCrop>;
    update(id: string, userId: string, updateDto: UpdateFarmerCropDto): Promise<FarmerCrop>;
    remove(id: string, userId: string): Promise<void>;
}
