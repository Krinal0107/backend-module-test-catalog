import { validationResult } from 'express-validator';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';
import { toPage } from '../utils/pagination.js';

export async function listBooks(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { q, author, category, yearFrom, yearTo, sort } = req.query;
  const { page, limit, skip } = toPage(req.query);

  const where = {};
  if (q) {
    const regex = new RegExp(String(q), 'i');
    where.$or = [{ title: regex }, { author: regex }, { isbn: regex }, { category: regex }];
  }
  if (author) where.author = new RegExp(String(author), 'i');
  if (category) where.category = new RegExp(String(category), 'i');
  if (yearFrom || yearTo) {
    where.publishedYear = {};
    if (yearFrom) where.publishedYear.$gte = Number(yearFrom);
    if (yearTo) where.publishedYear.$lte = Number(yearTo);
  }

  const sortMap = {
    createdAt: { createdAt: 1 },
    '-createdAt': { createdAt: -1 },
    title: { title: 1 },
    '-title': { title: -1 },
    publishedYear: { publishedYear: 1 },
    '-publishedYear': { publishedYear: -1 },
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };

  const [items, total] = await Promise.all([
    Book.find(where).sort(sortObj).skip(skip).limit(limit),
    Book.countDocuments(where),
  ]);

  res.json({
    ok: true,
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getBookById(req, res) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ ok: false, message: 'Invalid id format' });
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ ok: false, message: 'Not found' });
  res.json({ ok: true, data: book });
}

export async function createBook(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const createdBy = req.user?.userId ?? null;
  const userExists = createdBy ? await User.exists({ _id: createdBy }) : null;

  const book = await Book.create({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn ?? null,
    publishedYear: req.body.publishedYear ?? null,
    category: req.body.category ?? null,
    summary: req.body.summary ?? null,
    createdBy: userExists ? createdBy : null,
  });
  res.status(201).json({ ok: true, data: book });
}

export async function updateBook(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ ok: false, message: 'Invalid id format' });

  const updates = {};
  ['title','author','isbn','publishedYear','category','summary','price','inStock'].forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const book = await Book.findByIdAndUpdate(id, updates, { new: true });
  if (!book) return res.status(404).json({ ok: false, message: 'Not found' });
  res.json({ ok: true, data: book });
}

export async function deleteBook(req, res) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ ok: false, message: 'Invalid id format' });

  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ ok: false, message: 'Not found' });
  res.status(204).send();
}


