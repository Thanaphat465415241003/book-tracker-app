import express from 'express';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getBooks).post(protect, addBook);
router.route('/:id').put(protect, updateBook).delete(protect, deleteBook);

export default router;