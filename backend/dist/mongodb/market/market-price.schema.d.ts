import { Document } from 'mongoose';
import { IMarketPrice } from '../../market/interfaces/market.interface';
export type MarketPriceV2Document = MarketPriceV2 & Document;
export declare class MarketPriceV2 implements IMarketPrice {
    commodity: string;
    market: string;
    district: string;
    state: string;
    date: Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    unit: string;
    source: string;
    variety?: string;
    grade?: string;
    normalizedAt: Date;
    qualityScore: number;
}
export declare const MarketPriceV2Schema: import("mongoose").Schema<MarketPriceV2, import("mongoose").Model<MarketPriceV2, any, any, any, any, any, MarketPriceV2>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    commodity?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    market?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    modalPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    variety?: import("mongoose").SchemaDefinitionProperty<string | undefined, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grade?: import("mongoose").SchemaDefinitionProperty<string | undefined, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    normalizedAt?: import("mongoose").SchemaDefinitionProperty<Date, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qualityScore?: import("mongoose").SchemaDefinitionProperty<number, MarketPriceV2, Document<unknown, {}, MarketPriceV2, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketPriceV2 & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketPriceV2>;
