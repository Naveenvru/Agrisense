import { Document } from 'mongoose';
export declare class YieldAnalyticsDocument extends Document {
    scope: string;
    regionLevel?: string;
    regionName?: string;
    cropName?: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    cropWiseYield: Record<string, number>;
    regionWiseYield: Record<string, number>;
    monthlyYield: Record<string, number>;
    seasonWiseYield: Record<string, number>;
    averageYieldKg: number;
    yieldTrend: Array<{
        period: string;
        yieldKg: number;
    }>;
    topPerformingCrops: Array<{
        cropName: string;
        averageYieldKg: number;
        confidence: number;
    }>;
    generatedAt: Date;
}
export declare const YieldAnalyticsSchema: import("mongoose").Schema<YieldAnalyticsDocument, import("mongoose").Model<YieldAnalyticsDocument, any, any, any, any, any, YieldAnalyticsDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scope?: import("mongoose").SchemaDefinitionProperty<string, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string | undefined, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodType?: import("mongoose").SchemaDefinitionProperty<string, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodStart?: import("mongoose").SchemaDefinitionProperty<Date, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodEnd?: import("mongoose").SchemaDefinitionProperty<Date, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropWiseYield?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionWiseYield?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    monthlyYield?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seasonWiseYield?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageYieldKg?: import("mongoose").SchemaDefinitionProperty<number, YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yieldTrend?: import("mongoose").SchemaDefinitionProperty<{
        period: string;
        yieldKg: number;
    }[], YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    topPerformingCrops?: import("mongoose").SchemaDefinitionProperty<{
        cropName: string;
        averageYieldKg: number;
        confidence: number;
    }[], YieldAnalyticsDocument, Document<unknown, {}, YieldAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, YieldAnalyticsDocument>;
