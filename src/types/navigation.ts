// src/types/navigation.ts
export type Book = {
  id: string;
  title: string;
  author: string;
  status: 'not_read' | 'reading' | 'finished';
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
