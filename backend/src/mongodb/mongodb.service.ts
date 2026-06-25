import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongodbService {
  private readonly logger = new Logger(MongodbService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async checkConnection(): Promise<boolean> {
    const readyState = this.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const isConnected = readyState === 1;
    
    if (isConnected) {
      this.logger.log('MongoDB connection is healthy.');
    } else {
      this.logger.warn(`MongoDB connection state is ${readyState}.`);
    }
    
    return isConnected;
  }
}
