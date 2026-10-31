import { Document } from 'mongoose';
import { IMarketRawRecord } from '../../market/interfaces/market.interface';
export type MarketRawDocument = MarketRaw & Document;
export declare class MarketRaw implements IMarketRawRecord {
    commodity: string;
    variety: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    arrivalQty?: number;
    grade?: string;
    unit: string;
    source: string;
    rawPayload: string;
    collectedAt: Date;
    providerFetchedAt?: Date;
    batchId: string;
}
export declare const MarketRawSchema: import("mongoose").Schema<MarketRaw, import("mongoose").Model<MarketRaw, any, any, any, any, any, MarketRaw>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketRaw, Document<unknown, {}, MarketRaw, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    commodity?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    variety?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    market?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modalPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    arrivalQty?: import("mongoose").SchemaDefinitionProperty<number | undefined, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grade?: import("mongoose").SchemaDefinitionProperty<string | undefined, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rawPayload?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    collectedAt?: import("mongoose").SchemaDefinitionProperty<Date, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    providerFetchedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    batchId?: import("mongoose").SchemaDefinitionProperty<string, MarketRaw, Document<unknown, {}, MarketRaw, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketRaw & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketRaw>;
