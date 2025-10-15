import { Book } from '@/types/navigation';
import React, { createContext, ReactNode, useState } from 'react';

type BookContextType = {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
};

export const BookContext = createContext<BookContextType>({
  books: [],
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
});

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);

  const addBook = (book: Book) => setBooks((prev) => [book, ...prev]);
  const updateBook = (book: Book) =>
    setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  const deleteBook = (id: string) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};
