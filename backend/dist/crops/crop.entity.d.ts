export declare class Crop {
    id: string;
    cropName: string;
    scientificName: string | null;
    cropCategory: string | null;
    season: string | null;
    durationDays: number | null;
    waterRequirement: string | null;
    idealTemperatureMin: number | null;
    idealTemperatureMax: number | null;
    createdAt: Date;
    updatedAt: Date;
}
