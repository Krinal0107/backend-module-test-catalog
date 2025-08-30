import { Router } from 'express';
import { listBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/book.controller.js';
import { createBookValidator, updateBookValidator, idParamValidator, listQueryValidator } from '../validators/book.validators.js';
import { requireAuth, requireOwnerOrAdmin } from '../middlewares/auth.js';
import { Book } from '../models/Book.js';

const resolveOwner = async (req) => {
  const b = await Book.findById(req.params.id);
  return b?.createdBy ? String(b.createdBy) : null;
};

const router = Router();

router.get('/', listQueryValidator, listBooks);
router.get('/:id', idParamValidator, getBookById);

router.post('/', requireAuth, createBookValidator, createBook);
router.put('/:id', requireAuth, idParamValidator, requireOwnerOrAdmin(resolveOwner), updateBookValidator, updateBook);
router.delete('/:id', requireAuth, idParamValidator, requireOwnerOrAdmin(resolveOwner), deleteBook);

export default router;


