import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    generate(farmerCropId: string, req: any): Promise<{
        message: string;
        data: {
            eventsGenerated: number;
        };
    }>;
    findAll(req: any): Promise<{
        data: import("./calendar-event.entity").CalendarEvent[];
        count: number;
    }>;
    findAllEvents(req: any): Promise<{
        data: import("./calendar-event.entity").CalendarEvent[];
        count: number;
    }>;
    findCropCycleEvents(farmerCropId: string, req: any): Promise<{
        data: import("./calendar-event.entity").CalendarEvent[];
        count: number;
    }>;
    findOneEvent(id: string, req: any): Promise<{
        data: import("./calendar-event.entity").CalendarEvent;
    }>;
    completeEvent(id: string, req: any): Promise<{
        message: string;
        data: import("./calendar-event.entity").CalendarEvent;
    }>;
}
