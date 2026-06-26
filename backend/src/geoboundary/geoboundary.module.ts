import { Module } from '@nestjs/common';
import { GeoBoundaryService } from './geoboundary.service';
import { MasterDataModule } from '../master-data/master-data.module';
import { StorageModule } from '../storage/common/storage.module';
import { GeoBoundaryMongoModule } from '../mongodb/geoboundary/geoboundary-mongo.module';
import { GeoBoundaryRepository } from './repository/geoboundary.repository';
import { MockGeoBoundaryProvider } from './providers/mock-geoboundary.provider';
import { GEOBOUNDARY_PROVIDER } from './providers/geoboundary-provider.interface';
import { GeoBoundaryController } from './geoboundary.controller';

@Module({
  imports: [MasterDataModule, StorageModule, GeoBoundaryMongoModule],
  providers: [
    GeoBoundaryService, 
    GeoBoundaryRepository,
    {
      provide: GEOBOUNDARY_PROVIDER,
      useClass: MockGeoBoundaryProvider,
    },
  ],
  controllers: [GeoBoundaryController],
  exports: [GeoBoundaryService, GeoBoundaryRepository],
})
export class GeoBoundaryModule {}
