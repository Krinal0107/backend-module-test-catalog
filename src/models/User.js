import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 180 },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true });

export const User = model('User', UserSchema);


