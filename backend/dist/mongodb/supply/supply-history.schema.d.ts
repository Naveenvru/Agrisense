import { Document } from 'mongoose';
export declare class SupplyHistoryDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    previousSupplyKg?: number;
    newSupplyKg: number;
    reason: string;
    confidence: number;
    riskLevel: string;
    supplyDensityKgPerAcre: number;
    explanations: string[];
    recommendations: Record<string, any>[];
    version: number;
    predictionTimestamp: Date;
}
export declare const SupplyHistorySchema: import("mongoose").Schema<SupplyHistoryDocument, import("mongoose").Model<SupplyHistoryDocument, any, any, any, any, any, SupplyHistoryDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    predictionTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousSupplyKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newSupplyKg?: import("mongoose").SchemaDefinitionProperty<number, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    supplyDensityKgPerAcre?: import("mongoose").SchemaDefinitionProperty<number, SupplyHistoryDocument, Document<unknown, {}, SupplyHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SupplyHistoryDocument>;
