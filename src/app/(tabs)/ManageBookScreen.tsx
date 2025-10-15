import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Book, RootStackParamList, RootTabParamList } from '@/types/navigation';
import { Picker } from '@react-native-picker/picker';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Manage'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ManageBookScreen({ navigation }: Props) {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Atomic Habits', author: 'James Clear', status: 'reading' },
    { id: '2', title: 'Deep Work', author: 'Cal Newport', status: 'not_read' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<Book['status']>('not_read');
  const [filter, setFilter] = useState<'all' | Book['status']>('all');

  const openAddModal = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setStatus('not_read');
    setModalVisible(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setStatus(book.status);
    setModalVisible(true);
  };

  const saveBook = () => {
    if (!title || !author) {
      Alert.alert('กรุณากรอกชื่อหนังสือและผู้แต่ง');
      return;
    }

    if (editingBook) {
      setBooks(prev =>
        prev.map(b => (b.id === editingBook.id ? { ...b, title, author, status } : b))
      );
    } else {
      const newBook: Book = { id: Date.now().toString(), title, author, status };
      setBooks(prev => [newBook, ...prev]);
    }

    setModalVisible(false);
  };

  const deleteBook = (bookId: string) => {
    Alert.alert('ลบหนังสือ', 'คุณแน่ใจหรือไม่ว่าจะลบหนังสือเล่มนี้?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: () => setBooks(prev => prev.filter(b => b.id !== bookId)),
      },
    ]);
  };

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'not_read':
        return { background: '#FFE4B5', text: '#D2691E', icon: '⭐' };
      case 'reading':
        return { background: '#E6F3FF', text: '#1E90FF', icon: '📖' };
      case 'finished':
        return { background: '#E8F5E8', text: '#228B22', icon: '✅' };
      default:
        return { background: '#F5F5F5', text: '#666666', icon: '📚' };
    }
  };

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

  const getBookStats = () => {
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'reading').length,
      finished: books.filter(b => b.status === 'finished').length,
      notRead: books.filter(b => b.status === 'not_read').length
    };
  };

  const getFilteredBooks = () => {
    if (filter === 'all') return books;
    return books.filter(book => book.status === filter);
  };

  const stats = getBookStats();
  const filteredBooks = getFilteredBooks();

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.headerTitle}>จัดการหนังสือ 📚</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              จัดระเบียบคลังหนังสือของคุณ
            </ThemedText>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.totalBooksCard}>
              <ThemedText style={styles.totalBooksNumber}>{stats.total}</ThemedText>
              <ThemedText style={styles.totalBooksLabel}>เล่มทั้งหมด</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.readingStatCard]}>
          <ThemedText style={styles.statIcon}>📖</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.reading}</ThemedText>
          <ThemedText style={styles.statLabel}>กำลังอ่าน</ThemedText>
        </View>
        <View style={[styles.statCard, styles.finishedStatCard]}>
          <ThemedText style={styles.statIcon}>✅</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.finished}</ThemedText>
          <ThemedText style={styles.statLabel}>อ่านจบแล้ว</ThemedText>
        </View>
        <View style={[styles.statCard, styles.notReadStatCard]}>
          <ThemedText style={styles.statIcon}>⭐</ThemedText>
          <ThemedText style={styles.statNumber}>{stats.notRead}</ThemedText>
          <ThemedText style={styles.statLabel}>ยังไม่ได้อ่าน</ThemedText>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ThemedText style={styles.sectionTitle}>หมวดหมู่</ThemedText>
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'ทั้งหมด', icon: '📚' },
            { key: 'reading', label: 'กำลังอ่าน', icon: '📖' },
            { key: 'finished', label: 'อ่านจบแล้ว', icon: '✅' },
            { key: 'not_read', label: 'ยังไม่ได้อ่าน', icon: '⭐' },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.key}
              style={[
                styles.filterButton,
                filter === filterOption.key && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(filterOption.key as any)}
            >
              <View style={styles.filterButtonContent}>
                <ThemedText style={styles.filterEmoji}>
                  {filterOption.icon}
                </ThemedText>
                <ThemedText style={[
                  styles.filterButtonText,
                  filter === filterOption.key && styles.activeFilterText
                ]}>
                  {filterOption.label}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Add Book Section */}
      <View style={styles.addSection}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
        >
          <View style={styles.addButtonContent}>
            <View style={styles.addButtonIcon}>
              <ThemedText style={styles.addButtonIconText}>+</ThemedText>
            </View>
            <View style={styles.addButtonTextContainer}>
              <ThemedText style={styles.addButtonTitle}>เพิ่มหนังสือใหม่</ThemedText>
              <ThemedText style={styles.addButtonSubtitle}>เพิ่มหนังสือเข้าคลังของคุณ</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Books List Section */}
      <View style={styles.booksSection}>
        <View style={styles.booksSectionHeader}>
          <ThemedText style={styles.sectionTitle}>รายการหนังสือ</ThemedText>
          <ThemedText style={styles.booksCount}>({filteredBooks.length} เล่ม)</ThemedText>
          {filteredBooks.length === 0 && filter !== 'all' && (
            <ThemedText style={styles.emptyFilterText}>
              ไม่มีหนังสือใน{filter === 'reading' ? 'สถานะกำลังอ่าน' : 
                            filter === 'finished' ? 'สถานะอ่านจบแล้ว' : 
                            'สถานะยังไม่ได้อ่าน'}
            </ThemedText>
          )}
          {books.length === 0 && (
            <ThemedText style={styles.emptyStateText}>ยังไม่มีหนังสือ</ThemedText>
          )}
        </View>

        <FlatList
          data={filteredBooks}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <View style={styles.bookCard}>
                {/* Book Icon */}
                <View style={[styles.bookIcon, { backgroundColor: getStatusColor(item.status).background }]}>
                  <ThemedText style={styles.bookIconText}>
                    {getStatusColor(item.status).icon}
                  </ThemedText>
                </View>

                {/* Book Info */}
                <View style={styles.bookInfo}>
                  <ThemedText style={styles.bookTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.bookAuthor}>
                    โดย {item.author}
                  </ThemedText>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status).background }]}>
                    <ThemedText style={[styles.statusText, { color: getStatusColor(item.status).text }]}>
                      {getStatusLabel(item.status)}
                    </ThemedText>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item)}
                  >
                    <ThemedText style={styles.editButtonText}>✏️</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteBook(item.id)}
                  >
                    <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <ThemedText style={styles.modalTitle}>
                  {editingBook ? '✏️ แก้ไขหนังสือ' : '📚 เพิ่มหนังสือใหม่'}
                </ThemedText>
                <ThemedText style={styles.modalSubtitle}>
                  {editingBook ? 'แก้ไขข้อมูลหนังสือ' : 'เพิ่มหนังสือเข้าคลังของคุณ'}
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <ThemedText style={styles.inputLabel}>📖 ชื่อหนังสือ</ThemedText>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="กรอกชื่อหนังสือ"
                  placeholderTextColor="#A0522D"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <ThemedText style={styles.inputLabel}>👤 ผู้แต่ง</ThemedText>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="กรอกชื่อผู้แต่ง"
                  placeholderTextColor="#A0522D"
                  value={author}
                  onChangeText={setAuthor}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <ThemedText style={styles.inputLabel}>📊 สถานะ</ThemedText>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={status}
                    style={styles.picker}
                    onValueChange={(value: Book['status']) => setStatus(value)}
                  >
                    <Picker.Item label="⭐ ยังไม่ได้อ่าน" value="not_read" />
                    <Picker.Item label="📖 กำลังอ่าน" value="reading" />
                    <Picker.Item label="✅ อ่านจบแล้ว" value="finished" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.cancelModalButtonText}>ยกเลิก</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveBook}
              >
                <ThemedText style={styles.saveButtonText}>
                  {editingBook ? '💾 บันทึกการแก้ไข' : '➕ เพิ่มหนังสือ'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
  },

  // Header
  headerContainer: {
    backgroundColor: '#F4E99B',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0522D',
  },
  headerRight: {
    marginLeft: 16,
  },
  totalBooksCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  totalBooksNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  totalBooksLabel: {
    fontSize: 10,
    color: '#A0522D',
    marginTop: 2,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 11,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 11,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  readingStatCard: {
    backgroundColor: '#E6F3FF',
  },
  finishedStatCard: {
    backgroundColor: '#E8F5E8',
  },
  notReadStatCard: {
    backgroundColor: '#FFE4B5',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#A0522D',
    textAlign: 'center',
  },

  // Add Section
  addSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  addButtonIcon: {
    width: 40,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButtonIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButtonTextContainer: {
    flex: 1,
  },
  addButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 2,
  },
  addButtonSubtitle: {
    fontSize: 12,
    color: '#A0522D',
  },

  // Books Section
  booksSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  booksSectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  booksCount: {
    fontSize: 14,
    color: '#A0522D',
    marginLeft: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#A0522D',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyFilterText: {
    fontSize: 12,
    color: '#A0522D',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 12,
  },
  bookItem: {
    marginBottom: 8,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookIconText: {
    fontSize: 18,
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
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#A0522D',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A0522D',
  },
  modalBody: {
    paddingHorizontal: 20,
  },

  // Input Group
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
  input: {
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#F4E99B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 14,
    color: '#8B4513',
  },
  pickerContainer: {
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#F4E99B',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#8B4513',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 10,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#D4A574',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  cancelModalButtonText: {
    color: '#A0522D',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Filter Section
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 6,
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
    fontSize: 14,
    marginBottom: 4,
  },
  filterButtonText: {
    fontSize: 11,
    color: '#8B4513',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});