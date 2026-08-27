import { Document } from 'mongoose';
export declare class DemandIntelligenceDocument extends Document {
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
    currentDemandKg: number;
    expectedDemandKg: number;
    governmentProcurementKg: number;
    exportDemandKg: number;
    retailDemandKg: number;
    industrialDemandKg: number;
    festivalDemandKg: number;
    demandDensityKgPerAcre: number;
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
    version?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    cropVariety?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expectedHarvestDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerProfileId?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    areaAcres?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmerCropId?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    villageName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    talukName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stateName?: import("mongoose").SchemaDefinitionProperty<string | undefined, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskLevel?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mitigationRecommendations?: import("mongoose").SchemaDefinitionProperty<string[], DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    assessedAt?: import("mongoose").SchemaDefinitionProperty<Date, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    regionLevel?: import("mongoose").SchemaDefinitionProperty<"district" | "state" | "village" | "taluk", DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    confidence?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    explanation?: import("mongoose").SchemaDefinitionProperty<string, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskScore?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    riskReasons?: import("mongoose").SchemaDefinitionProperty<string[], DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    seasonalAnalysis?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    demandDensityKgPerAcre?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
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
    governmentProcurementKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    exportDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    retailDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    industrialDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    festivalDemandKg?: import("mongoose").SchemaDefinitionProperty<number, DemandIntelligenceDocument, Document<unknown, {}, DemandIntelligenceDocument, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<DemandIntelligenceDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, DemandIntelligenceDocument>;
