import {
  MONDO_DB_ID,
  MONGO_DB_NAME,
  MONGO_DB_PASSWORD,
  MONGO_DB_USER,
} from '@/app/api/utils/const';
import mongoose from 'mongoose';

export class MongoConnection {
  constructor() {}
  async init() {
    
    if (!MONGO_DB_USER || !MONGO_DB_PASSWORD) {
      return;
    }

    const mongoURI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_USER}.${MONDO_DB_ID}.mongodb.net/${MONGO_DB_NAME}`;

    try {
      if (mongoose.connection.readyState === 1) {
        console.log(`[MONGO]: Connection already init.`);
        return;
      }
      await mongoose.connect(mongoURI);
    } catch (error) {
      console.log(error);
    }
  }
}

export default mongoose;
