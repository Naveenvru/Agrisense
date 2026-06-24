import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Generate calendar events for a farmer crop' })
  @Post('generate/:farmerCropId')
  async generate(@Param('farmerCropId') farmerCropId: string, @Req() req: any) {
    const result = await this.calendarService.generate(farmerCropId, req.user.id);
    return {
      message: result.message,
      data: {
        eventsGenerated: result.count,
      },
    };
  }

  @ApiOperation({ summary: 'List calendar events' })
  @Get('events')
  async findAllEvents(@Req() req: any) {
    const events = await this.calendarService.findAll(req.user.id);
    return {
      data: events,
      count: events.length,
    };
  }

  @ApiOperation({ summary: 'Get specific calendar event' })
  @Get('events/:id')
  async findOneEvent(@Param('id') id: string, @Req() req: any) {
    const event = await this.calendarService.findOne(id, req.user.id);
    return {
      data: event,
    };
  }

  @ApiOperation({ summary: 'Complete a specific calendar event' })
  @Patch('events/:id/complete')
  async completeEvent(@Param('id') id: string, @Req() req: any) {
    const event = await this.calendarService.complete(id, req.user.id);
    return {
      message: 'Event marked as completed',
      data: event,
    };
  }
}
