import { Document } from 'mongoose';
export declare class HarvestHistoryDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    predictionTimestamp: Date;
    previousHarvestDate?: Date;
    newHarvestDate?: Date;
    reason: string;
    readinessScore: number;
    harvestScore: number;
    confidenceScore: number;
    riskLevel: string;
    delayDays: number;
    explanations: string[];
    version: number;
}
export declare const HarvestHistorySchema: import("mongoose").Schema<HarvestHistoryDocument, import("mongoose").Model<HarvestHistoryDocument, any, any, any, any, any, HarvestHistoryDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readinessScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceScore?: import("mongoose").SchemaDefinitionProperty<number, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    delayDays?: import("mongoose").SchemaDefinitionProperty<number, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    predictionTimestamp?: import("mongoose").SchemaDefinitionProperty<Date, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, HarvestHistoryDocument, Document<unknown, {}, HarvestHistoryDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<HarvestHistoryDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, HarvestHistoryDocument>;
