import { Document } from 'mongoose';
export declare class HarvestIntelligenceDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    cropVariety?: string;
    daysElapsed: number;
    daysRemaining: number;
    growthPercentage: number;
    lifecycleStage: string;
    readinessScore: number;
    readinessStatus: string;
    earliestHarvestDate?: Date;
    optimalHarvestDate?: Date;
    latestSafeHarvestDate?: Date;
    harvestScore: number;
    confidenceScore: number;
    riskLevel: string;
    riskFactors: string[];
    mitigationRecommendations: string[];
    delayDays: number;
    delayReasons: string[];
    delayActions: string[];
    expectedYieldKg?: number;
    yieldConfidence?: number;
    qualityGrade?: string;
    qualityExplanation?: string;
    workersRequired?: number;
    harvestDurationDays?: number;
    estimatedLabourHours?: number;
    equipmentRecommendations: string[];
    storageRecommendation?: string;
    storageExplanation?: string;
    explanations: string[];
    assessedAt: Date;
    version: number;
}
export declare const HarvestIntelligenceSchema: import("mongoose").Schema<HarvestIntelligenceDocument, import("mongoose").Model<HarvestIntelligenceDocument, any, any, any, any, any, HarvestIntelligenceDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropVariety?: import("mongoose").SchemaDefinitionProperty<string | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    daysElapsed?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    daysRemaining?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    growthPercentage?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lifecycleStage?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readinessScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readinessStatus?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    earliestHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    optimalHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    latestSafeHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskFactors?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mitigationRecommendations?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    delayDays?: import("mongoose").SchemaDefinitionProperty<number, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    delayReasons?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    delayActions?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedYieldKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yieldConfidence?: import("mongoose").SchemaDefinitionProperty<number | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityGrade?: import("mongoose").SchemaDefinitionProperty<string | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityExplanation?: import("mongoose").SchemaDefinitionProperty<string | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    workersRequired?: import("mongoose").SchemaDefinitionProperty<number | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestDurationDays?: import("mongoose").SchemaDefinitionProperty<number | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    estimatedLabourHours?: import("mongoose").SchemaDefinitionProperty<number | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    equipmentRecommendations?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    storageRecommendation?: import("mongoose").SchemaDefinitionProperty<string | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    storageExplanation?: import("mongoose").SchemaDefinitionProperty<string | undefined, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    assessedAt?: import("mongoose").SchemaDefinitionProperty<Date, HarvestIntelligenceDocument, Document<unknown, {}, HarvestIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, HarvestIntelligenceDocument>;
