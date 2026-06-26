import { Document } from 'mongoose';
import { IMarketCache } from '../../market/interfaces/market.interface';
export type MarketCacheDocument = MarketCache & Document;
export declare class MarketCache implements IMarketCache {
    key: string;
    data: string;
    expiresAt: Date;
    source: string;
}
export declare const MarketCacheSchema: import("mongoose").Schema<MarketCache, import("mongoose").Model<MarketCache, any, any, any, any, any, MarketCache>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketCache, Document<unknown, {}, MarketCache, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketCache & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    key?: import("mongoose").SchemaDefinitionProperty<string, MarketCache, Document<unknown, {}, MarketCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketCache & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    data?: import("mongoose").SchemaDefinitionProperty<string, MarketCache, Document<unknown, {}, MarketCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketCache & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, MarketCache, Document<unknown, {}, MarketCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketCache & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, MarketCache, Document<unknown, {}, MarketCache, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketCache & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketCache>;
