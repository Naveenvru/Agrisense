import { Document } from 'mongoose';
export declare class HarvestAnalyticsDocument extends Document {
    regionLevel: string;
    regionName: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    totalFarmers: number;
    totalCrops: number;
    totalExpectedYieldKg: number;
    harvestedCount: number;
    readyCount: number;
    almostReadyCount: number;
    delayedCount: number;
    avgReadinessScore: number;
    avgHarvestScore: number;
    avgConfidenceScore: number;
    avgDelayDays: number;
    dominantRisks: string[];
    cropBreakdown: Record<string, {
        count: number;
        totalYieldKg: number;
        avgReadiness: number;
    }>;
    harvestTimeline: Record<string, number>;
    generatedAt: Date;
}
export declare const HarvestAnalyticsSchema: import("mongoose").Schema<HarvestAnalyticsDocument, import("mongoose").Model<HarvestAnalyticsDocument, any, any, any, any, any, HarvestAnalyticsDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<string, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodType?: import("mongoose").SchemaDefinitionProperty<string, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodStart?: import("mongoose").SchemaDefinitionProperty<Date, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodEnd?: import("mongoose").SchemaDefinitionProperty<Date, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalFarmers?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalCrops?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalExpectedYieldKg?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestedCount?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readyCount?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    almostReadyCount?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    delayedCount?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avgReadinessScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avgHarvestScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avgConfidenceScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avgDelayDays?: import("mongoose").SchemaDefinitionProperty<number, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dominantRisks?: import("mongoose").SchemaDefinitionProperty<string[], HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropBreakdown?: import("mongoose").SchemaDefinitionProperty<Record<string, {
        count: number;
        totalYieldKg: number;
        avgReadiness: number;
    }>, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestTimeline?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, HarvestAnalyticsDocument, Document<unknown, {}, HarvestAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, HarvestAnalyticsDocument>;
