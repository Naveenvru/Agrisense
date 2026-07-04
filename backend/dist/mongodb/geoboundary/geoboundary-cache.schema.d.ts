import { Document } from 'mongoose';
export declare class GeoBoundaryCache extends Document {
    latitude: number;
    longitude: number;
    villageName?: string;
    talukName?: string;
    districtName?: string;
    stateName?: string;
    countryName?: string;
    postalCode?: string;
    villageId?: string;
    talukId?: string;
    districtId?: string;
    stateId?: string;
    boundaryPolygon?: Record<string, any>;
    provider: string;
    polygonCacheKey?: string;
    resolvedAt: Date;
}
export declare const GeoBoundaryCacheSchema: import("mongoose").Schema<GeoBoundaryCache, import("mongoose").Model<GeoBoundaryCache, any, any, any, any, any, GeoBoundaryCache>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    latitude?: import("mongoose").SchemaDefinitionProperty<number, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    longitude?: import("mongoose").SchemaDefinitionProperty<number, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    provider?: import("mongoose").SchemaDefinitionProperty<string, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stateId?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtId?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    talukId?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    villageName?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    talukName?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtName?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stateName?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    countryName?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    postalCode?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    villageId?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    boundaryPolygon?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    polygonCacheKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resolvedAt?: import("mongoose").SchemaDefinitionProperty<Date, GeoBoundaryCache, Document<unknown, {}, GeoBoundaryCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeoBoundaryCache & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GeoBoundaryCache>;
