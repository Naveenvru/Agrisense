import { Document } from 'mongoose';
export declare class DemandIntelligenceDocument extends Document {
    cropName: string;
    cropCategory?: string;
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    expectedDemandKg: number;
    demandDensityKgPerTransaction: number;
    confidence: number;
    confidenceBand: string;
    trend: string;
    explanation: string;
    explanations: string[];
    risk: Record<string, any>;
    recommendations: Record<string, any>[];
    assessedAt: Date;
    version: number;
}
export declare const DemandIntelligenceSchema: import("mongoose").Schema<DemandIntelligenceDocument, import("mongoose").Model<DemandIntelligenceDocument, any, any, any, any, any, DemandIntelligenceDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropCategory?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<"village" | "taluk" | "district" | "state", DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    demandDensityKgPerTransaction?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceBand?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trend?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanation?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    risk?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    assessedAt?: import("mongoose").SchemaDefinitionProperty<Date, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DemandIntelligenceDocument>;
export declare class DemandHistoryDocument extends Document {
    cropName: string;
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    newDemandKg: number;
    previousDemandKg?: number;
    confidence: number;
    reason: string;
    explanations: string[];
    predictionTimestamp: Date;
}
export declare const DemandHistorySchema: import("mongoose").Schema<DemandHistoryDocument, import("mongoose").Model<DemandHistoryDocument, any, any, any, any, any, DemandHistoryDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<"village" | "taluk" | "district" | "state", DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousDemandKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    predictionTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DemandHistoryDocument>;
export declare class DemandAnalyticsDocument extends Document {
    scope: string;
    regionLevel?: string;
    regionName?: string;
    cropName?: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    cropWiseDemand: Record<string, number>;
    regionWiseDemand: Record<string, number>;
    weeklyDemand: Record<string, number>;
    monthlyDemand: Record<string, number>;
    seasonalDemand: Record<string, number>;
    averageDemandKg: number;
    demandTrend: Array<{
        period: string;
        demandKg: number;
    }>;
    topDemandRegions: Array<{
        regionLevel: string;
        regionName: string;
        demandKg: number;
        confidence: number;
    }>;
    cropDistribution: Array<{
        cropName: string;
        demandKg: number;
        sharePercent: number;
    }>;
    generatedAt: Date;
}
export declare const DemandAnalyticsSchema: import("mongoose").Schema<DemandAnalyticsDocument, import("mongoose").Model<DemandAnalyticsDocument, any, any, any, any, any, DemandAnalyticsDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scope?: import("mongoose").SchemaDefinitionProperty<string, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodType?: import("mongoose").SchemaDefinitionProperty<string, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodStart?: import("mongoose").SchemaDefinitionProperty<Date, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodEnd?: import("mongoose").SchemaDefinitionProperty<Date, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropWiseDemand?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionWiseDemand?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weeklyDemand?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    monthlyDemand?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seasonalDemand?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    demandTrend?: import("mongoose").SchemaDefinitionProperty<{
        period: string;
        demandKg: number;
    }[], DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    topDemandRegions?: import("mongoose").SchemaDefinitionProperty<{
        regionLevel: string;
        regionName: string;
        demandKg: number;
        confidence: number;
    }[], DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropDistribution?: import("mongoose").SchemaDefinitionProperty<{
        cropName: string;
        demandKg: number;
        sharePercent: number;
    }[], DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DemandAnalyticsDocument>;
