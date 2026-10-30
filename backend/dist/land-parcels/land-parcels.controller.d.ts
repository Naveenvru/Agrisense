import { LandParcelsService } from './land-parcels.service';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';
export declare class LandParcelsController {
    private landParcelsService;
    constructor(landParcelsService: LandParcelsService);
    previewArea(body: {
        boundaryGeoJson: unknown;
    }): Promise<{
        data: {
            areaSqm: number;
            areaAcres: number;
            areaHectares: number;
            centroid: {
                latitude: number;
                longitude: number;
            };
        };
    }>;
    findNearby(req: any, latitude: string, longitude: string, radiusMeters?: string): Promise<{
        data: any;
    }>;
    findContaining(req: any, latitude: string, longitude: string): Promise<{
        data: any;
    }>;
    create(req: any, createDto: CreateLandParcelDto): Promise<{
        message: string;
        data: any;
    }>;
    findAll(req: any): Promise<{
        data: any[];
        count: number;
    }>;
    findOne(id: string, req: any): Promise<{
        data: any;
    }>;
    overlapSummary(id: string, req: any): Promise<{
        data: {
            hasPotentialOverlap: boolean;
            intersectingParcelCount: number;
        };
    }>;
    update(id: string, req: any, updateDto: UpdateLandParcelDto): Promise<{
        message: string;
        data: any;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
