import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsNull } from 'typeorm';
import { CalendarEvent } from './calendar-event.entity';
import { CropCalendarTemplate } from './crop-calendar-template.entity';
import { CropStatus, FarmerCrop } from '../farmer-crops/farmer-crop.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventsRepository: Repository<CalendarEvent>,
    @InjectRepository(CropCalendarTemplate)
    private templatesRepository: Repository<CropCalendarTemplate>,
    @InjectRepository(FarmerCrop)
    private farmerCropsRepository: Repository<FarmerCrop>,
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
  ) {}

  /**
   * Helper to verify ownership of a FarmerCrop.
   */
  private async getVerifiedFarmerCrop(farmerCropId: string, userId: string): Promise<FarmerCrop> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new ForbiddenException('Farmer profile not found.');
    }

    const farmerCrop = await this.farmerCropsRepository.findOne({
      where: { id: farmerCropId },
      relations: { parcel: true },
    });

    if (!farmerCrop) {
      throw new NotFoundException('Farmer crop record not found');
    }

    if (farmerCrop.parcel.farmerProfileId !== profile.id) {
      throw new ForbiddenException('You do not have access to this farmer crop');
    }

    return farmerCrop;
  }

  /**
   * Helper to verify ownership of a CalendarEvent.
   */
  private async getVerifiedCalendarEvent(eventId: string, userId: string): Promise<CalendarEvent> {
    const event = await this.calendarEventsRepository.findOne({
      where: { id: eventId },
      relations: {
        farmerCrop: {
          parcel: true,
          crop: true,
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Calendar event not found');
    }

    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });

    if (!profile || event.farmerCrop.parcel.farmerProfileId !== profile.id) {
      throw new ForbiddenException('You do not have access to this calendar event');
    }

    return event;
  }

  async generate(farmerCropId: string, userId: string): Promise<{ message: string; count: number }> {
    const farmerCrop = await this.getVerifiedFarmerCrop(farmerCropId, userId);

    if (!farmerCrop.sowingDate) {
      throw new BadRequestException('Sowing date must be set on the farmer crop to generate a calendar');
    }

    // Generation is safe to retry: keep an existing timeline instead of creating
    // duplicate work or failing after the crop itself has already been saved.
    const existingEventsCount = await this.calendarEventsRepository.count({
      where: { farmerCropId, sourceConditionId: IsNull() },
    });

    if (existingEventsCount > 0) return { message: 'Calendar already exists for this crop cycle', count: existingEventsCount };

    const templates = await this.templatesRepository.find({
      where: { cropId: farmerCrop.cropId },
    });

    if (templates.length === 0) {
      throw new NotFoundException('No calendar templates found for this crop type');
    }

    const sowingDate = new Date(farmerCrop.sowingDate);
    const eventsToCreate = templates.map((template) => {
      const eventDate = new Date(sowingDate);
      eventDate.setDate(eventDate.getDate() + template.dayOffset);

      return this.calendarEventsRepository.create({
        farmerCropId,
        eventDate,
        taskName: template.taskName,
        taskDescription: template.taskDescription,
      });
    });

    await this.calendarEventsRepository.save(eventsToCreate);

    return {
      message: 'Calendar events generated successfully',
      count: eventsToCreate.length,
    };
  }

  async findAll(userId: string): Promise<CalendarEvent[]> {
    const profile = await this.farmerProfilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return [];
    }

    return this.calendarEventsRepository.find({
      where: {
        farmerCrop: {
          status: CropStatus.ACTIVE,
          parcel: {
            farmerProfileId: profile.id,
          },
        },
      },
      relations: {
        farmerCrop: {
          parcel: true,
          crop: true,
        },
      },
      order: {
        eventDate: 'ASC',
      },
      select: {
        id: true,
        eventDate: true,
        taskName: true,
        taskDescription: true,
        isCompleted: true,
        completedAt: true,
        generatedByWeather: true,
        generatedByAi: true,
        farmerCrop: {
          id: true,
          cropVariety: true,
          parcel: {
            id: true,
            parcelName: true,
          },
          crop: {
            id: true,
            cropName: true,
          },
        },
      },
    });
  }

  async findForCropCycle(farmerCropId: string, userId: string): Promise<CalendarEvent[]> {
    await this.getVerifiedFarmerCrop(farmerCropId, userId);
    return this.calendarEventsRepository.find({
      where: { farmerCropId },
      relations: { farmerCrop: { parcel: true, crop: true } },
      order: { eventDate: 'ASC' },
      select: {
        id: true, eventDate: true, taskName: true, taskDescription: true,
        isCompleted: true, completedAt: true, sourceConditionId: true,
        generatedByAi: true,
        farmerCrop: {
          id: true, cropVariety: true,
          parcel: { id: true, parcelName: true },
          crop: { id: true, cropName: true },
        },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<CalendarEvent> {
    const event = await this.getVerifiedCalendarEvent(id, userId);

    // Re-fetch to apply consistent select statement
    return this.calendarEventsRepository.findOneOrFail({
      where: { id: event.id },
      relations: {
        farmerCrop: {
          parcel: true,
          crop: true,
        },
      },
      select: {
        id: true,
        eventDate: true,
        taskName: true,
        taskDescription: true,
        isCompleted: true,
        completedAt: true,
        generatedByWeather: true,
        generatedByAi: true,
        farmerCrop: {
          id: true,
          cropVariety: true,
          parcel: {
            id: true,
            parcelName: true,
          },
          crop: {
            id: true,
            cropName: true,
          },
        },
      },
    });
  }

  async complete(id: string, userId: string): Promise<CalendarEvent> {
    const event = await this.getVerifiedCalendarEvent(id, userId);

    if (event.isCompleted) {
      throw new BadRequestException('Event is already marked as completed');
    }

    event.isCompleted = true;
    event.completedAt = new Date();

    await this.calendarEventsRepository.save(event);
    return this.findOne(id, userId);
  }
}
