import { Repository } from 'typeorm';
import { CalendarEvent } from './calendar-event.entity';
import { CropCalendarTemplate } from './crop-calendar-template.entity';
import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
export declare class CalendarService {
    private calendarEventsRepository;
    private templatesRepository;
    private farmerCropsRepository;
    private farmerProfilesRepository;
    constructor(calendarEventsRepository: Repository<CalendarEvent>, templatesRepository: Repository<CropCalendarTemplate>, farmerCropsRepository: Repository<FarmerCrop>, farmerProfilesRepository: Repository<FarmerProfile>);
    private getVerifiedFarmerCrop;
    private getVerifiedCalendarEvent;
    generate(farmerCropId: string, userId: string): Promise<{
        message: string;
        count: number;
    }>;
    findAll(userId: string): Promise<CalendarEvent[]>;
    findOne(id: string, userId: string): Promise<CalendarEvent>;
    complete(id: string, userId: string): Promise<CalendarEvent>;
}
