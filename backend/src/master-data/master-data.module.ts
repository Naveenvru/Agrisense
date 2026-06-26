import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MasterDataMongoModule } from '../mongodb/master-data/master-data-mongo.module';
import { MasterDataRepository } from './repository/master-data.repository';
import { GovernmentDataProvider } from './providers/government-data.provider';
import { StorageModule } from '../storage/common/storage.module';
import { HashMapService } from './data-structures/hash-map.service';
import { TrieSearchService } from './data-structures/trie-search.service';

@Module({
  imports: [MasterDataMongoModule, StorageModule],
  controllers: [MasterDataController],
  providers: [MasterDataService, MasterDataRepository, GovernmentDataProvider, HashMapService, TrieSearchService],
  exports: [MasterDataService, MasterDataRepository, GovernmentDataProvider, HashMapService, TrieSearchService],
})
export class MasterDataModule {}
