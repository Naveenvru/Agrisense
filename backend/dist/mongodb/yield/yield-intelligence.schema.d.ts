import { Document } from 'mongoose';
export declare class YieldIntelligenceDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    cropVariety?: string;
    cropCategory?: string;
    areaAcres: number;
    soilType?: string;
    soilFertilityScore: number;
    irrigationType?: string;
    lifecycleStage: string;
    growthPercentage: number;
    readinessScore: number;
    currentWeatherSummary: string;
    expectedYieldKg: number;
    yieldPerAcreKg: number;
    expectedProductionKg: number;
    confidence: number;
    explanation: string;
    explanations: string[];
    riskLevel: string;
    riskScore: number;
    riskReasons: string[];
    mitigationRecommendations: string[];
    confidenceBand: string;
    confidenceExplanation: string;
    qualityGrade: string;
    qualityScore: number;
    qualityFactors: string[];
    qualityExplanation: string;
    expectedLossPercent: number;
    expectedLossQuantityKg: number;
    lossReasons: string[];
    lossExplanation: string;
    recommendations: Record<string, any>[];
    weather: Record<string, any>;
    weatherHistory: Record<string, any>[];
    activities: Record<string, any>;
    lifecycle: Record<string, any>;
    assessedAt: Date;
    version: number;
}
export declare const YieldIntelligenceSchema: import("mongoose").Schema<YieldIntelligenceDocument, import("mongoose").Model<YieldIntelligenceDocument, any, any, any, any, any, YieldIntelligenceDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropCategory?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropVariety?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    areaAcres?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    soilType?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    irrigationType?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weather?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityScore?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    growthPercentage?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lifecycleStage?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readinessScore?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mitigationRecommendations?: import("mongoose").SchemaDefinitionProperty<string[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedYieldKg?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityGrade?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityExplanation?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    assessedAt?: import("mongoose").SchemaDefinitionProperty<Date, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    soilFertilityScore?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentWeatherSummary?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yieldPerAcreKg?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedProductionKg?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanation?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskScore?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskReasons?: import("mongoose").SchemaDefinitionProperty<string[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceBand?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceExplanation?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityFactors?: import("mongoose").SchemaDefinitionProperty<string[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedLossPercent?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedLossQuantityKg?: import("mongoose").SchemaDefinitionProperty<number, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lossReasons?: import("mongoose").SchemaDefinitionProperty<string[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lossExplanation?: import("mongoose").SchemaDefinitionProperty<string, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherHistory?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    activities?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lifecycle?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, YieldIntelligenceDocument, Document<unknown, {}, YieldIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, YieldIntelligenceDocument>;
