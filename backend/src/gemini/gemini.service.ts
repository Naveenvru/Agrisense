import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { AGRISENSE_SYSTEM_PROMPT } from './prompts/agrisense-system.prompt';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { ExplainContextDto } from './dto/explain-context.dto';
import { AnalyzeDiseaseDto } from './dto/analyze-disease.dto';
import { User } from '../users/user.entity';
import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { LandParcelsService } from '../land-parcels/land-parcels.service';
import { FarmerCropsService } from '../farmer-crops/farmer-crops.service';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private aiClient: GoogleGenAI | null = null;
  private readonly primaryModel: string;
  private readonly fallbackModel: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FarmerProfile)
    private farmerProfilesRepository: Repository<FarmerProfile>,
    private landParcelsService: LandParcelsService,
    private farmerCropsService: FarmerCropsService,
    private calendarService: CalendarService,
  ) {
    this.primaryModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.6-flash';
    this.fallbackModel = this.configService.get<string>('GEMINI_FALLBACK_MODEL') || 'gemini-3.8-flash';
    this.initClient();
  }

  private initClient() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey !== 'placeholder') {
      try {
        this.aiClient = new GoogleGenAI({ apiKey });
        this.logger.log(`Initialized Gemini Client with primary model: ${this.primaryModel}`);
      } catch (error: any) {
        this.logger.error(`Failed to initialize GoogleGenAI client: ${error?.message}`);
        this.aiClient = null;
      }
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is missing or set to placeholder in backend/.env. Gemini features will return a configuration warning.',
      );
    }
  }

  private getClient(): GoogleGenAI {
    if (!this.aiClient) {
      this.initClient();
    }
    if (!this.aiClient) {
      throw new ServiceUnavailableException(
        'Gemini AI is not configured. Please add a valid GEMINI_API_KEY to backend/.env file.',
      );
    }
    return this.aiClient;
  }

  private async buildUserContext(userId?: string): Promise<string> {
    if (!userId) return '';

    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      const profile = await this.farmerProfilesRepository.findOne({ where: { userId } });
      const parcels = await this.landParcelsService.findAllByUser(userId);
      let crops: any[] = [];
      try {
        crops = await this.farmerCropsService.findAll(userId);
      } catch (e) {}

      const observations = await this.farmerCropsService.findConditionsForCycles(userId, crops.map((crop: any) => String(crop.id)));

      let contextStr = `\n--- AUTHENTICATED FARMER GROUND TRUTH CONTEXT ---\n`;
      contextStr += `- Farmer Name: ${user?.name || 'Farmer'}\n`;
      if (user?.email) contextStr += `- Email: ${user.email}\n`;
      if (profile?.district || profile?.state || profile?.village) {
        contextStr += `- Profile Default Region: ${[profile.village, profile.district, profile.state].filter(Boolean).join(', ')}\n`;
      }

      if (parcels && parcels.length > 0) {
        contextStr += `- Connected Land Parcels (${parcels.length}):\n`;
        parcels.forEach((p: any, idx: number) => {
          const locDetails: string[] = [];
          if (p.additionalMetadata?.district) locDetails.push(`District: ${p.additionalMetadata.district}`);
          if (p.additionalMetadata?.state) locDetails.push(`State: ${p.additionalMetadata.state}`);
          if (p.latitude !== undefined && p.longitude !== undefined) locDetails.push(`GPS Coordinates: (${p.latitude}, ${p.longitude})`);
          
          contextStr += `  * Parcel #${idx + 1}: "${p.parcelName || 'Field'}" | Area: ${p.areaAcres || 'N/A'} Acres | Soil: ${p.soilType || 'N/A'} | Irrigation: ${p.irrigationType || 'N/A'} | Location: ${locDetails.join(' | ') || 'Unmapped'}\n`;
        });
      } else {
        contextStr += `- Land Parcels: No land parcels added yet.\n`;
      }

      if (crops && crops.length > 0) {
        contextStr += `- Field Crop Cycles (${crops.length}; status is recorded by the farmer):\n`;
        crops.forEach((c: any, idx: number) => {
          const cropObservations = observations.filter((item) => String(item.farmerCropId) === String(c.id)).slice(0, 5);
          contextStr += `  * Cycle #${idx + 1}: Field "${c.parcel?.parcelName || `Parcel ${c.parcelId}`}" | Crop: ${c.crop?.cropName || c.cropVariety || 'Crop'} | Variety: ${c.cropVariety || 'not recorded'} | Status: ${c.status || 'unknown'} | Sowing: ${c.sowingDate || 'not recorded'} | Expected harvest: ${c.expectedHarvestDate || 'not recorded'}\n`;
          cropObservations.forEach((observation) => {
            const values = [
              `condition: ${observation.conditionLabel}`,
              observation.growthStage ? `growth stage: ${observation.growthStage}` : null,
              observation.soilMoisturePercent != null ? `soil moisture: ${observation.soilMoisturePercent}%` : null,
              observation.airTemperatureC != null ? `air temperature: ${observation.airTemperatureC}°C` : null,
              observation.rainfallMm != null ? `rainfall: ${observation.rainfallMm} mm` : null,
              observation.irrigationStatus ? `irrigation: ${observation.irrigationStatus}` : null,
              observation.symptomsAndSigns ? `symptoms/signs: ${observation.symptomsAndSigns}` : null,
              observation.notes ? `farmer notes: ${observation.notes}` : null,
            ].filter(Boolean).join('; ');
            contextStr += `    - Farmer-reported field observation (${observation.observedAt.toISOString()}): ${values}\n`;
          });
        });
      } else {
        contextStr += `- Active Crops: No crops added yet.\n`;
      }

      try {
        const tasks = await this.calendarService.findAll(userId);
        if (tasks.length) {
          contextStr += `- Crop calendar tasks for active crop cycles (template-generated and condition-aware AI tasks):\n`;
          tasks.slice(0, 20).forEach((task) => {
            contextStr += `  * ${task.eventDate} | ${task.farmerCrop?.parcel?.parcelName || 'Field'} | ${task.farmerCrop?.crop?.cropName || task.farmerCrop?.cropVariety || 'Crop'} | ${task.taskName}: ${task.taskDescription || 'No description'} | ${task.isCompleted ? 'completed' : 'pending'}\n`;
          });
        }
      } catch (error: any) {
        this.logger.warn(`Could not load crop calendar for Gemini context: ${error?.message}`);
      }

      contextStr += `--------------------------------------------------\n`;
      return contextStr;
    } catch (err: any) {
      this.logger.warn(`Failed to build user context for Gemini: ${err?.message}`);
      return '';
    }
  }

  async generateResponse(dto: GeneratePromptDto, userId?: string): Promise<{ text: string; model: string }> {
    const client = this.getClient();

    const userContext = await this.buildUserContext(userId);
    const systemInstruction = `${AGRISENSE_SYSTEM_PROMPT}\n${userContext}`;

    try {
      let responseText = '';
      let usedModel = this.primaryModel;

      try {
        const response = await client.models.generateContent({
          model: this.primaryModel,
          contents: dto.prompt,
          config: {
            systemInstruction,
          },
        });
        responseText = response.text || '';
      } catch (primaryErr: any) {
        this.logger.warn(`Primary model ${this.primaryModel} failed (${primaryErr?.message}). Attempting fallback model ${this.fallbackModel}...`);
        usedModel = this.fallbackModel;
        const response = await client.models.generateContent({
          model: this.fallbackModel,
          contents: dto.prompt,
          config: {
            systemInstruction,
          },
        });
        responseText = response.text || '';
      }

      const text = responseText || 'No output generated from Gemini AI.';
      return { text, model: usedModel };
    } catch (error: any) {
      return this.handleGeminiError(error);
    }
  }

  async explainContext(dto: ExplainContextDto, userId?: string): Promise<{ explanation: string; model: string }> {
    const client = this.getClient();

    const userContext = await this.buildUserContext(userId);
    const systemInstruction = `${AGRISENSE_SYSTEM_PROMPT}\n${userContext}`;

    const formattedData = JSON.stringify(dto.contextData, null, 2);
    const userPrompt = `
Task: Explain the following AgriSense agricultural data in clear, farmer-friendly, and actionable language.

Topic / Action: "${dto.title}"
${dto.customQuery ? `User Specific Question: "${dto.customQuery}"` : ''}

AgriSense Data Snapshot (Ground Truth):
\`\`\`json
${formattedData}
\`\`\`

Instructions:
1. Explain what these numbers mean for the farmer's crop, financial profit, or field operations.
2. Maintain exact precision on all figures provided above (do not change price estimates, yields, or weather values).
3. Offer 2-3 specific, actionable next steps.
`;

    try {
      let responseText = '';
      let usedModel = this.primaryModel;

      try {
        const response = await client.models.generateContent({
          model: this.primaryModel,
          contents: userPrompt,
          config: {
            systemInstruction,
          },
        });
        responseText = response.text || '';
      } catch (err: any) {
        usedModel = this.fallbackModel;
        const response = await client.models.generateContent({
          model: this.fallbackModel,
          contents: userPrompt,
          config: {
            systemInstruction,
          },
        });
        responseText = response.text || '';
      }

      const explanation = responseText || 'Unable to generate explanation.';
      return { explanation, model: usedModel };
    } catch (error: any) {
      return this.handleGeminiError(error);
    }
  }

  async analyzeDiseaseImage(dto: AnalyzeDiseaseDto, userId?: string): Promise<{ diagnosis: string; model: string }> {
    const client = this.getClient();

    const userContext = await this.buildUserContext(userId);
    const systemInstruction = `${AGRISENSE_SYSTEM_PROMPT}\n${userContext}`;

    let cleanBase64 = dto.imageBase64 || '';
    let mimeType = dto.mimeType || 'image/jpeg';

    if (cleanBase64.includes(';base64,')) {
      const parts = cleanBase64.split(';base64,');
      const extractedMime = parts[0].replace('data:', '');
      if (extractedMime) mimeType = extractedMime;
      cleanBase64 = parts[1];
    }
    cleanBase64 = cleanBase64.replace(/[\r\n\s]/g, '');

    const promptText = `
You are an expert plant pathologist and agricultural diagnostic scientist for AgriSense.
Carefully examine the attached photo of the crop/leaf/plant.

Farmer Provided Information:
- Crop Type / Variety: "${dto.cropName || 'Not specified (please identify from image)'}"
- Observed Symptoms / Notes: "${dto.notes || 'None provided'}"

Provide an accurate, clear, and comprehensive plant pathology diagnostic report formatted in Markdown:

### 🔬 1. Disease & Pest Identification
- **Diagnosis / Pathogen Name**: (Common name & scientific name if applicable)
- **Confidence Level**: (High / Medium / Low based on visual clarity)
- **Visual Symptoms Identified**: Bullet points of key lesions, spots, wilting, or discoloration seen.

### ⚠️ 2. Severity & Risk Level
- **Severity**: (Mild / Moderate / Severe)
- **Potential Field Impact**: Risk of spread to neighboring plants and estimated yield impact.

### 🌿 3. Actionable Treatment Plan
- **Organic & Biological Control**: Natural, organic remedies or bio-pesticides
- **Chemical Control**: Specific recommended fungicides/insecticides with application instructions (if appropriate)
- **Immediate Field Practices**: Pruning, watering adjustment, isolation

### 🛡️ 4. Prevention & Long-term Care
- Prevention strategies for upcoming crop cycles.
`;

    try {
      let responseText = '';
      let usedModel = this.primaryModel;

      const contents: any = [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        promptText,
      ];

      try {
        const response = await client.models.generateContent({
          model: this.primaryModel,
          contents,
          config: { systemInstruction },
        });
        responseText = response.text || '';
      } catch (primaryErr: any) {
        this.logger.warn(`Primary model ${this.primaryModel} vision analysis failed (${primaryErr?.message}). Retrying fallback ${this.fallbackModel}...`);
        usedModel = this.fallbackModel;
        const response = await client.models.generateContent({
          model: this.fallbackModel,
          contents,
          config: { systemInstruction },
        });
        responseText = response.text || '';
      }

      const diagnosis = responseText || 'Unable to analyze image.';
      return { diagnosis, model: usedModel };
    } catch (error: any) {
      return this.handleGeminiError(error);
    }
  }

  private handleGeminiError(error: any): never {
    const message = error?.message || 'Unknown Gemini AI error';
    this.logger.error(`Gemini API Error: ${message}`, error?.stack);

    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED') || message.includes('Quota')) {
      throw new ServiceUnavailableException(
        'AgriSense AI capacity limit reached. Please wait a few moments and try again.',
      );
    }

    if (message.includes('API key') || message.includes('UNAUTHENTICATED') || message.includes('401')) {
      throw new ServiceUnavailableException(
        'Gemini API authentication failed. Please verify GEMINI_API_KEY in backend/.env.',
      );
    }

    if (message.includes('INVALID_ARGUMENT') || message.includes('400')) {
      throw new BadRequestException(`Gemini API Invalid Request: ${message}`);
    }

    throw new ServiceUnavailableException(
      `Gemini AI Error: ${message}`,
    );
  }
}

