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

    try {
        const bookRef = booksCollection.doc(id);
        const doc = await bookRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (doc.data()?.userId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        // 1. สร้าง Object ว่างสำหรับเก็บข้อมูลที่จะอัปเดต
        const { title, author, status, publisher, category } = req.body;
        const updatedData: { [key: string]: any } = {};

        // 2. เช็คและเพิ่มเฉพาะ field ที่มีค่า (ไม่ใช่ undefined)
        if (title !== undefined) updatedData.title = title;
        if (author !== undefined) updatedData.author = author;
        if (status !== undefined) updatedData.status = status;
        if (publisher !== undefined) updatedData.publisher = publisher;
        if (category !== undefined) updatedData.category = category;
        
        // 3. ตรวจสอบว่ามีข้อมูลส่งมาให้อัปเดตหรือไม่
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'No valid data provided for update' });
        }

        // 4. อัปเดตด้วยข้อมูลที่ผ่านการกรองแล้ว
        await bookRef.update(updatedData);

        const updatedDoc = await bookRef.get();
        res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });

    } catch (error) {
        console.error("Error updating book:", error); // Log error จริงๆ ที่ฝั่ง server
        res.status(500).json({ message: 'Server Error while updating book' });
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