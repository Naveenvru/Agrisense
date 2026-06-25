import { Document } from 'mongoose';
import { IMarketPrice } from '../interfaces/market-price.interface';
export type MarketPriceDocument = MarketPrice & Document;
export declare class MarketPrice implements IMarketPrice {
    crop: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    minimumPrice: number;
    maximumPrice: number;
    modalPrice: number;
    arrivalQuantity: number;
    source: string;
}
export declare const MarketPriceSchema: import("mongoose").Schema<MarketPrice, import("mongoose").Model<MarketPrice, any, any, any, any, any, MarketPrice>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketPrice, Document<unknown, {}, MarketPrice, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    crop?: import("mongoose").SchemaDefinitionProperty<string, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    market?: import("mongoose").SchemaDefinitionProperty<string, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minimumPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maximumPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modalPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    arrivalQuantity?: import("mongoose").SchemaDefinitionProperty<number, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, MarketPrice, Document<unknown, {}, MarketPrice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPrice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketPrice>;
