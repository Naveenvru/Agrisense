import { Module } from '@nestjs/common';
import { StorageRegistry } from './storage.registry';
import { StorageService } from './storage.service';
import { StorageHealthService } from './storage-health.service';
import { LocalStorageProvider } from '../local/local-storage.provider';
import { DataLakeService } from '../datalake/datalake.service';

/**
 * StorageModule
 *
 * Root NestJS module for the storage infrastructure layer.
 *
 * Exports
 * ────────
 * ✔ StorageService       — façade for all storage operations
 * ✔ StorageHealthService — health checks for all storage providers
 * ✔ StorageRegistry      — provider directory
 * ✔ DataLakeService      — raw data lake read/write
 *
 * Adding a new provider (IPFS, S3, Azure)
 * ────────────────────────────────────────
 * 1. Implement IStorageProvider
 * 2. Add to providers[] and exports[] below
 * 3. Register in StorageHealthService.onModuleInit() or your own OnModuleInit
 * 4. Zero other changes needed
 */
@Module({
  providers: [
    StorageRegistry,
    LocalStorageProvider,
    StorageService,
    StorageHealthService,
    DataLakeService,
  ],
  exports: [
    StorageRegistry,
    StorageService,
    StorageHealthService,
    DataLakeService,
    LocalStorageProvider,
  ],
})
export class StorageModule {}
