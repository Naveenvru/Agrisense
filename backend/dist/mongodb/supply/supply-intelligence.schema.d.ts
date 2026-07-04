import { Document } from 'mongoose';
export declare class SupplyIntelligenceDocument extends Document {
    farmerCropId: string;
    farmerProfileId: string;
    cropName: string;
    cropVariety?: string;
    cropCategory?: string;
    regionLevel: 'village' | 'taluk' | 'district' | 'state';
    regionName: string;
    villageName?: string;
    talukName?: string;
    districtName?: string;
    stateName?: string;
    areaAcres: number;
    expectedHarvestDate?: Date;
    expectedSupplyKg: number;
    expectedYieldKg: number;
    availableSupplyKg: number;
    supplyDensityKgPerAcre: number;
    confidence: number;
    confidenceBand: string;
    explanation: string;
    explanations: string[];
    riskLevel: string;
    riskScore: number;
    riskReasons: string[];
    mitigationRecommendations: string[];
    seasonalAnalysis: Record<string, any>;
    timeline: Record<string, any>[];
    recommendations: Record<string, any>[];
    harvestStage: string;
    yieldStage: string;
    weatherSummary: string;
    assessedAt: Date;
    version: number;
}
export declare const SupplyIntelligenceSchema: import("mongoose").Schema<SupplyIntelligenceDocument, import("mongoose").Model<SupplyIntelligenceDocument, any, any, any, any, any, SupplyIntelligenceDocument>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidence?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    supplyDensityKgPerAcre?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanations?: import("mongoose").SchemaDefinitionProperty<string[], SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    version?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropVariety?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropCategory?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<"village" | "taluk" | "district" | "state", SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionName?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    villageName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    talukName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stateName?: import("mongoose").SchemaDefinitionProperty<string | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    areaAcres?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedSupplyKg?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedYieldKg?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    availableSupplyKg?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    confidenceBand?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    explanation?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskScore?: import("mongoose").SchemaDefinitionProperty<number, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskReasons?: import("mongoose").SchemaDefinitionProperty<string[], SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mitigationRecommendations?: import("mongoose").SchemaDefinitionProperty<string[], SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    seasonalAnalysis?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    harvestStage?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    yieldStage?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherSummary?: import("mongoose").SchemaDefinitionProperty<string, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    assessedAt?: import("mongoose").SchemaDefinitionProperty<Date, SupplyIntelligenceDocument, Document<unknown, {}, SupplyIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupplyIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SupplyIntelligenceDocument>;
