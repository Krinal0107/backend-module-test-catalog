import { Schema, model } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  author: { type: String, required: true, trim: true, maxlength: 200 },
  isbn: { type: String, default: null, trim: true },
  publishedYear: { type: Number, default: null },
  category: { type: String, default: null, trim: true },
  summary: { type: String, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  price: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

export const Book = model('Book', BookSchema);


