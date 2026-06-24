import { Crop } from '../crops/crop.entity';
export declare class CropCalendarTemplate {
    id: string;
    cropId: string;
    crop: Crop;
    dayOffset: number;
    taskName: string;
    taskDescription: string | null;
    priority: string | null;
    createdAt: Date;
    updatedAt: Date;
}
