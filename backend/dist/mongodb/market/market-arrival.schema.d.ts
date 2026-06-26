import { Document } from 'mongoose';
import { IMarketArrival } from '../../market/interfaces/market.interface';
export type MarketArrivalDocument = MarketArrival & Document;
export declare class MarketArrival implements IMarketArrival {
    commodity: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    arrivalQty: number;
    unit: string;
    source: string;
}
export declare const MarketArrivalSchema: import("mongoose").Schema<MarketArrival, import("mongoose").Model<MarketArrival, any, any, any, any, any, MarketArrival>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketArrival, Document<unknown, {}, MarketArrival, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    commodity?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    market?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    arrivalQty?: import("mongoose").SchemaDefinitionProperty<number, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, MarketArrival, Document<unknown, {}, MarketArrival, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketArrival & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketArrival>;
