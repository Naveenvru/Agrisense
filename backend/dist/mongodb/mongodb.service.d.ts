import { Connection } from 'mongoose';
export declare class MongodbService {
    private readonly connection;
    private readonly logger;
    constructor(connection: Connection);
    checkConnection(): Promise<boolean>;
}
