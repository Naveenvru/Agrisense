import { Document } from 'mongoose';
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
    scope?: import("mongoose").SchemaDefinitionProperty<string, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
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
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, DemandAnalyticsDocument, Document<unknown, {}, DemandAnalyticsDocument, {
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
}, DemandAnalyticsDocument>;
