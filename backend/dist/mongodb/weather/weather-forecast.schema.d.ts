import { Document } from 'mongoose';
import { IWeatherForecast } from '../interfaces/weather.interface';
export type WeatherForecastDocument = WeatherForecast & Document;
export declare class WeatherForecast implements IWeatherForecast {
    locationId: string;
    forecastDate: Date;
    temperature: number;
    humidity: number;
    rainProbability: number;
    windSpeed: number;
    weatherCondition: string;
    source: string;
}
export declare const WeatherForecastSchema: import("mongoose").Schema<WeatherForecast, import("mongoose").Model<WeatherForecast, any, any, any, any, any, WeatherForecast>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeatherForecast, Document<unknown, {}, WeatherForecast, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    locationId?: import("mongoose").SchemaDefinitionProperty<string, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    forecastDate?: import("mongoose").SchemaDefinitionProperty<Date, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperature?: import("mongoose").SchemaDefinitionProperty<number, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    humidity?: import("mongoose").SchemaDefinitionProperty<number, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rainProbability?: import("mongoose").SchemaDefinitionProperty<number, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    windSpeed?: import("mongoose").SchemaDefinitionProperty<number, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherCondition?: import("mongoose").SchemaDefinitionProperty<string, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, WeatherForecast, Document<unknown, {}, WeatherForecast, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeatherForecast & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, WeatherForecast>;
