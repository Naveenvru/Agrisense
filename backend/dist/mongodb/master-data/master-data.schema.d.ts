import { Document } from 'mongoose';
export declare class State extends Document {
    name: string;
    code: string;
}
export declare const StateSchema: import("mongoose").Schema<State, import("mongoose").Model<State, any, any, any, any, any, State>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, State, Document<unknown, {}, State, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<State & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, State, Document<unknown, {}, State, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<State & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, State, Document<unknown, {}, State, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<State & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string, State, Document<unknown, {}, State, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<State & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, State>;
export declare class District extends Document {
    name: string;
    stateId: string;
}
export declare const DistrictSchema: import("mongoose").Schema<District, import("mongoose").Model<District, any, any, any, any, any, District>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, District, Document<unknown, {}, District, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<District & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, District, Document<unknown, {}, District, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<District & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, District, Document<unknown, {}, District, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<District & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stateId?: import("mongoose").SchemaDefinitionProperty<string, District, Document<unknown, {}, District, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<District & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, District>;
export declare class Taluk extends Document {
    name: string;
    districtId: string;
}
export declare const TalukSchema: import("mongoose").Schema<Taluk, import("mongoose").Model<Taluk, any, any, any, any, any, Taluk>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Taluk, Document<unknown, {}, Taluk, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Taluk & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Taluk, Document<unknown, {}, Taluk, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Taluk & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Taluk, Document<unknown, {}, Taluk, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Taluk & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtId?: import("mongoose").SchemaDefinitionProperty<string, Taluk, Document<unknown, {}, Taluk, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Taluk & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Taluk>;
export declare class Village extends Document {
    name: string;
    talukId: string;
}
export declare const VillageSchema: import("mongoose").Schema<Village, import("mongoose").Model<Village, any, any, any, any, any, Village>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Village, Document<unknown, {}, Village, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Village & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Village, Document<unknown, {}, Village, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Village & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Village, Document<unknown, {}, Village, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Village & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    talukId?: import("mongoose").SchemaDefinitionProperty<string, Village, Document<unknown, {}, Village, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Village & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Village>;
export declare class Mandi extends Document {
    name: string;
    districtId: string;
}
export declare const MandiSchema: import("mongoose").Schema<Mandi, import("mongoose").Model<Mandi, any, any, any, any, any, Mandi>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Mandi, Document<unknown, {}, Mandi, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Mandi & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Mandi, Document<unknown, {}, Mandi, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mandi & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Mandi, Document<unknown, {}, Mandi, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mandi & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    districtId?: import("mongoose").SchemaDefinitionProperty<string, Mandi, Document<unknown, {}, Mandi, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Mandi & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Mandi>;
export declare class Commodity extends Document {
    name: string;
    category: string;
}
export declare const CommoditySchema: import("mongoose").Schema<Commodity, import("mongoose").Model<Commodity, any, any, any, any, any, Commodity>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Commodity, Document<unknown, {}, Commodity, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Commodity & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Commodity, Document<unknown, {}, Commodity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commodity & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Commodity, Document<unknown, {}, Commodity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commodity & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Commodity, Document<unknown, {}, Commodity, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Commodity & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Commodity>;
export declare class CropVariety extends Document {
    name: string;
    commodityId: string;
}
export declare const CropVarietySchema: import("mongoose").Schema<CropVariety, import("mongoose").Model<CropVariety, any, any, any, any, any, CropVariety>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CropVariety, Document<unknown, {}, CropVariety, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CropVariety & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, CropVariety, Document<unknown, {}, CropVariety, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CropVariety & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, CropVariety, Document<unknown, {}, CropVariety, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CropVariety & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    commodityId?: import("mongoose").SchemaDefinitionProperty<string, CropVariety, Document<unknown, {}, CropVariety, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CropVariety & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CropVariety>;
export declare class Season extends Document {
    name: string;
    startMonth: number;
    endMonth: number;
}
export declare const SeasonSchema: import("mongoose").Schema<Season, import("mongoose").Model<Season, any, any, any, any, any, Season>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Season, Document<unknown, {}, Season, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Season & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Season, Document<unknown, {}, Season, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Season & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Season, Document<unknown, {}, Season, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Season & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startMonth?: import("mongoose").SchemaDefinitionProperty<number, Season, Document<unknown, {}, Season, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Season & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endMonth?: import("mongoose").SchemaDefinitionProperty<number, Season, Document<unknown, {}, Season, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Season & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Season>;
export declare class SoilType extends Document {
    name: string;
    description: string;
}
export declare const SoilTypeSchema: import("mongoose").Schema<SoilType, import("mongoose").Model<SoilType, any, any, any, any, any, SoilType>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SoilType, Document<unknown, {}, SoilType, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SoilType & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, SoilType, Document<unknown, {}, SoilType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SoilType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, SoilType, Document<unknown, {}, SoilType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SoilType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, SoilType, Document<unknown, {}, SoilType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SoilType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SoilType>;
export declare class IrrigationType extends Document {
    name: string;
}
export declare const IrrigationTypeSchema: import("mongoose").Schema<IrrigationType, import("mongoose").Model<IrrigationType, any, any, any, any, any, IrrigationType>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IrrigationType, Document<unknown, {}, IrrigationType, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<IrrigationType & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, IrrigationType, Document<unknown, {}, IrrigationType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IrrigationType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, IrrigationType, Document<unknown, {}, IrrigationType, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<IrrigationType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, IrrigationType>;
export declare class Fertilizer extends Document {
    name: string;
    type: string;
}
export declare const FertilizerSchema: import("mongoose").Schema<Fertilizer, import("mongoose").Model<Fertilizer, any, any, any, any, any, Fertilizer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fertilizer, Document<unknown, {}, Fertilizer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Fertilizer & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Fertilizer, Document<unknown, {}, Fertilizer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fertilizer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Fertilizer, Document<unknown, {}, Fertilizer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fertilizer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Fertilizer, Document<unknown, {}, Fertilizer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Fertilizer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Fertilizer>;
export declare class Pesticide extends Document {
    name: string;
    type: string;
}
export declare const PesticideSchema: import("mongoose").Schema<Pesticide, import("mongoose").Model<Pesticide, any, any, any, any, any, Pesticide>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pesticide, Document<unknown, {}, Pesticide, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Pesticide & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Pesticide, Document<unknown, {}, Pesticide, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pesticide & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Pesticide, Document<unknown, {}, Pesticide, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pesticide & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Pesticide, Document<unknown, {}, Pesticide, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Pesticide & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Pesticide>;
