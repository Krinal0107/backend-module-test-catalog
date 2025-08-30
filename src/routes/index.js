import { Router } from 'express';
import auth from './auth.routes.js';
import books from './book.routes.js';

const api = Router();
api.use('/users', auth);
api.use('/books', books);
export default api;


