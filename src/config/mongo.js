import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (e) => console.error('MongoDB error', e));
}


