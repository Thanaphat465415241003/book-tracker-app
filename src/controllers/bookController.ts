import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/authMiddleware';

const booksCollection = db.collection('books');

export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await booksCollection.where('userId', '==', req.user.id).get();
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addBook = async (req: AuthRequest, res: Response) => {
  const { title, author, status, publisher, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  try {
    const newBook = {
      userId: req.user.id,
      title,
      author,
      status: status || 'not_read',
      publisher: publisher || '',
      category: category || '',
      createdAt: new Date().toISOString(),
    };
    const docRef = await booksCollection.add(newBook);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, author, status, publisher, category } = req.body;

    try {
        const bookRef = booksCollection.doc(id);
        const doc = await bookRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (doc.data()?.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await bookRef.update({ title, author, status, publisher, category });
        res.status(200).json({ id: doc.id, ... (await bookRef.get()).data() });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const bookRef = booksCollection.doc(id);
        const doc = await bookRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (doc.data()?.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await bookRef.delete();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};