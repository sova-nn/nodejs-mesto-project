import mongoose from 'mongoose';
import 'process';

export default async function initDb() {
  const db = await mongoose.connect(process.env.MONGO_URL || '');
  return db;
}