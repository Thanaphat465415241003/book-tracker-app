import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Book } from '@/types/navigation';
import { router } from 'expo-router'; // ✅ ใช้ router global
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const initialBooks: Book[] = [
  { id: '1', title: 'Atomic Habits', author: 'James Clear', status: 'finished' },
  { id: '2', title: 'Deep Work', author: 'Cal Newport', status: 'reading' },
  { id: '3', title: 'Clean Code', author: 'Robert C. Martin', status: 'not_read' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<'all' | Book['status']>('all');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

  useEffect(() => {
    let filtered = books;
    if (filter !== 'all') filtered = filtered.filter((b) => b.status === filter);
    if (searchText.trim() !== '')
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(searchText.toLowerCase())
      );
    setFilteredBooks(filtered);
  }, [books, searchText, filter]);

  const getStatusLabel = (status: Book['status']) => {
    switch (status) {
      case 'not_read':
        return 'ยังไม่ได้อ่าน';
      case 'reading':
        return 'กำลังอ่าน';
      case 'finished':
        return 'อ่านจบแล้ว';
      default:
        return 'ทั้งหมด';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FEF9C3' }]}>
      {/* Header with gradient background */}
      <View style={styles.headerContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeTitle}>สวัสดี! 👋</ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>มาอ่านหนังสือกันเถอะ</ThemedText>
        </View>

        {/* Profile Section */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => router.push('/ProfileScreen')} // ✅ ไปหน้าโปรไฟล์
        >
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>👤</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/EditProfileScreen')}
          >
            <ThemedText style={styles.editButtonText}>แก้ไข</ThemedText>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.finishedCard]}>
          <ThemedText style={styles.statNumber}>
            {books.filter(b => b.status === 'finished').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>อ่านจบแล้ว</ThemedText>
        </View>
        <View style={[styles.statCard, styles.readingCard]}>
          <ThemedText style={styles.statNumber}>
            {books.filter(b => b.status === 'reading').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>กำลังอ่าน</ThemedText>
        </View>
        <View style={[styles.statCard, styles.notReadCard]}>
          <ThemedText style={styles.statNumber}>
            {books.filter(b => b.status === 'not_read').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>ยังไม่ได้อ่าน</ThemedText>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <ThemedText style={styles.sectionTitle}>ค้นหาหนังสือ</ThemedText>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาหนังสือที่คุณต้องการ..."
            placeholderTextColor="#8B7355"
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.searchIcon}>
            <ThemedText style={styles.searchIconText}>🔍</ThemedText>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ThemedText style={styles.sectionTitle}>หมวดหมู่</ThemedText>
        <View style={styles.filterContainer}>
          {['all', 'reading', 'finished', 'not_read'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(status as any)}
            >
              <View style={styles.filterButtonContent}>
                <ThemedText style={styles.filterEmoji}>
                  {status === 'all' ? '📚' : 
                   status === 'reading' ? '📖' : 
                   status === 'finished' ? '✅' : '⭐'}
                </ThemedText>
                <ThemedText style={[
                  styles.filterButtonText,
                  filter === status && styles.activeFilterText
                ]}>
                  {status === 'all' ? 'ทั้งหมด' : getStatusLabel(status as Book['status'])}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Books Section */}
      <View style={styles.booksSection}>
        <View style={styles.booksSectionHeader}>
          <ThemedText style={styles.sectionTitle}>รายการหนังสือ</ThemedText>
          <ThemedText style={styles.booksCount}>({filteredBooks.length} เล่ม)</ThemedText>
        </View>
        
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookCard}
              onPress={() =>
                router.push({
                  pathname: '/BookDetailScreen', // ✅ ไปหน้า BookDetail
                  params: { book: JSON.stringify(item) }, // ส่งเป็น string
                })
              }
            >
              <View style={styles.bookCardContent}>
                {/* Book Icon */}
                <View style={[styles.bookIcon, { backgroundColor: getStatusColor(item.status).background }]}>
                  <ThemedText style={styles.bookIconText}>📖</ThemedText>
                </View>

                {/* Book Info */}
                <View style={styles.bookInfo}>
                  <ThemedText style={styles.bookTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.bookAuthor}>
                    โดย {item.author}
                  </ThemedText>
                </View>

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status).background }]}>
                  <ThemedText style={[styles.statusText, { color: getStatusColor(item.status).text }]}>
                    {getStatusColor(item.status).icon} {getStatusLabel(item.status)}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

function getStatusColor(status: Book['status']) {
  switch (status) {
    case 'not_read':
      return { 
        background: '#FFE4B5', 
        text: '#D2691E',
        icon: '⭐'
      };
    case 'reading':
      return { 
        background: '#E6F3FF', 
        text: '#1E90FF',
        icon: '📖'
      };
    case 'finished':
      return { 
        background: '#E8F5E8', 
        text: '#228B22',
        icon: '✅'
      };
    default:
      return { 
        background: '#F5F5F5', 
        text: '#666666',
        icon: '📚'
      };
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },

  // Header
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F4E99B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#A0522D',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
  },
  editButton: {
    backgroundColor: '#D4A574',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  finishedCard: {
    backgroundColor: '#E8F5E8',
  },
  readingCard: {
    backgroundColor: '#E6F3FF',
  },
  notReadCard: {
    backgroundColor: '#FFE4B5',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#A0522D',
    textAlign: 'center',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 15,
    color: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconText: {
    fontSize: 16,
  },

  // Filter Section
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: '#D4A574',
    shadowColor: '#D4A574',
    shadowOpacity: 0.3,
  },
  filterButtonContent: {
    alignItems: 'center',
  },
  filterEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Books Section
  booksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  booksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  booksCount: {
    fontSize: 14,
    color: '#A0522D',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  bookCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  bookIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookIconText: {
    fontSize: 20,
  },
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#A0522D',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 90,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});