import { MongoClient, Db } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

let databaseInstance: Db;

export const connectDatabase = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URL ?? '');
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        databaseInstance = client.db(process.env.MONGODB_DB);
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
};

export const getDatabase = (): Db => {
  return databaseInstance;
};
