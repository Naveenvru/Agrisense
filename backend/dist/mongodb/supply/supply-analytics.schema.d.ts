import { Document } from 'mongoose';
export declare class SupplyAnalyticsDocument extends Document {
    scope: string;
    regionLevel?: string;
    regionName?: string;
    cropName?: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    cropWiseSupply: Record<string, number>;
    regionWiseSupply: Record<string, number>;
    weeklySupply: Record<string, number>;
    monthlySupply: Record<string, number>;
    seasonalSupply: Record<string, number>;
    averageSupplyKg: number;
    supplyTrend: Array<{
        period: string;
        supplyKg: number;
    }>;
    topProducingRegions: Array<{
        regionLevel: string;
        regionName: string;
        supplyKg: number;
        confidence: number;
    }>;
    cropDistribution: Array<{
        cropName: string;
        supplyKg: number;
        sharePercent: number;
    }>;
    generatedAt: Date;
}
export declare const SupplyAnalyticsSchema: import("mongoose").Schema<SupplyAnalyticsDocument, import("mongoose").Model<SupplyAnalyticsDocument, any, any, any, any, any, SupplyAnalyticsDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scope?: import("mongoose").SchemaDefinitionProperty<string, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodType?: import("mongoose").SchemaDefinitionProperty<string, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodStart?: import("mongoose").SchemaDefinitionProperty<Date, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    periodEnd?: import("mongoose").SchemaDefinitionProperty<Date, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropWiseSupply?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionWiseSupply?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weeklySupply?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    monthlySupply?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seasonalSupply?: import("mongoose").SchemaDefinitionProperty<Record<string, number>, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageSupplyKg?: import("mongoose").SchemaDefinitionProperty<number, SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    supplyTrend?: import("mongoose").SchemaDefinitionProperty<{
        period: string;
        supplyKg: number;
    }[], SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    topProducingRegions?: import("mongoose").SchemaDefinitionProperty<{
        regionLevel: string;
        regionName: string;
        supplyKg: number;
        confidence: number;
    }[], SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropDistribution?: import("mongoose").SchemaDefinitionProperty<{
        cropName: string;
        supplyKg: number;
        sharePercent: number;
    }[], SupplyAnalyticsDocument, Document<unknown, {}, SupplyAnalyticsDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyAnalyticsDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SupplyAnalyticsDocument>;
