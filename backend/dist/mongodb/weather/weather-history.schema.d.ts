import { Document } from 'mongoose';
import { IWeatherHistory } from '../interfaces/weather.interface';
export type WeatherHistoryDocument = WeatherHistory & Document;
export declare class WeatherHistory implements IWeatherHistory {
    locationId: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    weatherCondition: string;
    source: string;
}
export declare const WeatherHistorySchema: import("mongoose").Schema<WeatherHistory, import("mongoose").Model<WeatherHistory, any, any, any, any, any, WeatherHistory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeatherHistory, Document<unknown, {}, WeatherHistory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    locationId?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    district?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    country?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    latitude?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    longitude?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timestamp?: import("mongoose").SchemaDefinitionProperty<Date, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperature?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    humidity?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rainfall?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    windSpeed?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pressure?: import("mongoose").SchemaDefinitionProperty<number, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherCondition?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, WeatherHistory, Document<unknown, {}, WeatherHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, WeatherHistory>;
