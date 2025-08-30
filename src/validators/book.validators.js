import { body, param, query } from 'express-validator';

export const createBookValidator = [
  body('title').isString().trim().notEmpty(),
  body('author').isString().trim().notEmpty(),
  body('isbn').optional().isString().trim(),
  body('publishedYear').optional().isInt(),
  body('category').optional().isString().trim(),
  body('summary').optional().isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('inStock').optional().isBoolean(),
];

export const updateBookValidator = [
  body('title').optional().isString().trim().notEmpty(),
  body('author').optional().isString().trim().notEmpty(),
  body('isbn').optional().isString().trim(),
  body('publishedYear').optional().isInt(),
  body('category').optional().isString().trim(),
  body('summary').optional().isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('inStock').optional().isBoolean(),
  body().custom((val) => {
    const keys = Object.keys(val || {});
    const allowed = ['title','author','isbn','publishedYear','category','summary','price','inStock'];
    if (!keys.some(k => allowed.includes(k))) {
      throw new Error('At least one updatable field is required');
    }
    return true;
  }),
];

export const idParamValidator = [param('id').isString().isLength({ min: 24, max: 24 })];

export const listQueryValidator = [
  query('q').optional().isString(),
  query('author').optional().isString(),
  query('category').optional().isString(),
  query('yearFrom').optional().isInt(),
  query('yearTo').optional().isInt(),
  query('sort').optional().isIn(['createdAt','-createdAt','title','-title','publishedYear','-publishedYear']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];


