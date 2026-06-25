import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisense_mongo',
  database: process.env.MONGODB_DATABASE || 'agrisense_mongo',
}));
