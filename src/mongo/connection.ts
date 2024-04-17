import mongoose from 'mongoose';

export class MongoConnection {
  constructor() {}
  async init() {
    const MONGO_DB_USER = process.env.MONGO_DB_USER;
    const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;

    if (!MONGO_DB_USER || !MONGO_DB_PASSWORD) {
      return;
    }
    
    const mongoURI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_USER}.aylvojc.mongodb.net/${process.env.MONGO_DB_NAME}`;

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
