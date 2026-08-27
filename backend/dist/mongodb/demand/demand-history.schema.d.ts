import { Document } from 'mongoose';
export declare class DemandHistoryDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    previousDemandKg?: number;
    newDemandKg: number;
    reason: string;
    confidence: number;
    riskLevel: string;
    demandDensityKgPerAcre: number;
    explanations: string[];
    recommendations: Record<string, any>[];
    version: number;
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
    version?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
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
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
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
    predictionTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
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
    confidence?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
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
    newDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    demandDensityKgPerAcre?: import("mongoose").SchemaDefinitionProperty<number, DemandHistoryDocument, Document<unknown, {}, DemandHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DemandHistoryDocument>;
