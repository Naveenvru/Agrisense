import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';
export declare class CalendarEvent {
    id: string;
    farmerCropId: string;
    farmerCrop: FarmerCrop;
    eventDate: Date;
    taskName: string;
    taskDescription: string | null;
    isCompleted: boolean;
    completedAt: Date | null;
    generatedByWeather: boolean;
    createdAt: Date;
    updatedAt: Date;
}
