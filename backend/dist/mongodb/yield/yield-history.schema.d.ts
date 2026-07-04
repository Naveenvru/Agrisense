import { Document } from 'mongoose';
export declare class YieldHistoryDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    predictionTimestamp: Date;
    previousYieldKg?: number;
    newYieldKg?: number;
    reason: string;
    confidence: number;
    qualityGrade: string;
    riskLevel: string;
    lossPercent: number;
    explanations: string[];
    recommendations: Record<string, any>[];
    version: number;
}
export declare const YieldHistorySchema: import("mongoose").Schema<YieldHistoryDocument, import("mongoose").Model<YieldHistoryDocument, any, any, any, any, any, YieldHistoryDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityGrade?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    predictionTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousYieldKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newYieldKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lossPercent?: import("mongoose").SchemaDefinitionProperty<number, YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], YieldHistoryDocument, Document<unknown, {}, YieldHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<YieldHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, YieldHistoryDocument>;
