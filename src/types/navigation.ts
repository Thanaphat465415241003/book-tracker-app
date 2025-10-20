// src/types/navigation.ts
export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  readingGoal?: number;
  favoriteGenre?: string;
  location?: string;
  memberSince?: string; 
}

export type Book = {
  id: string;
  title: string;
  author: string;
  status: 'not_read' | 'reading' | 'finished';
  publisher?: string;
  publishYear?: number;
  pages?: number;
  category?: string;
  notes?: string;
};

// Stack Navigator
export type RootStackParamList = {
  MainTabs: undefined;          // Tab Navigator ซ้อนอยู่ตรงนี้
  BookDetail: { book: Book };   // หน้า detail
};

// Tab Navigator
export type RootTabParamList = {
  Home: undefined;
  Manage: undefined;
};
