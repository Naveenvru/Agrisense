import { Document } from 'mongoose';
import type { IMarketTrend, TrendDirection, TrendPeriod } from '../../market/interfaces/market.interface';
export type MarketTrendDocument = MarketTrend & Document;
export declare class MarketTrend implements IMarketTrend {
    commodity: string;
    market: string;
    state: string;
    district: string;
    period: TrendPeriod;
    startDate: Date;
    endDate: Date;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    totalArrival: number;
    trend: TrendDirection;
}
export declare const MarketTrendSchema: import("mongoose").Schema<MarketTrend, import("mongoose").Model<MarketTrend, any, any, any, any, any, MarketTrend>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketTrend, Document<unknown, {}, MarketTrend, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    commodity?: import("mongoose").SchemaDefinitionProperty<string, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    market?: import("mongoose").SchemaDefinitionProperty<string, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    period?: import("mongoose").SchemaDefinitionProperty<TrendPeriod, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avgPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxPrice?: import("mongoose").SchemaDefinitionProperty<number, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalArrival?: import("mongoose").SchemaDefinitionProperty<number, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    trend?: import("mongoose").SchemaDefinitionProperty<TrendDirection, MarketTrend, Document<unknown, {}, MarketTrend, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MarketTrend & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MarketTrend>;
