import { GeoBoundaryService } from './geoboundary.service';
import { ReverseGeocodeDto } from './dto/geoboundary.dto';
export declare class GeoBoundaryController {
    private readonly geoboundaryService;
    constructor(geoboundaryService: GeoBoundaryService);
    health(): {
        status: string;
        module: string;
    };
    reverseGeocode(query: ReverseGeocodeDto): Promise<import("./interfaces/geoboundary.interface").GeoBoundaryResult>;
}
