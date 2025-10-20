import { ThemedText } from '@/components/themed-text';
import { Book } from '@/types/navigation';
import { useLocalSearchParams, useFocusEffect, useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import api from '@/api/api';

export default function BookDetailScreen() {
  const router = useRouter();
  const { book: bookString } = useLocalSearchParams<{ book: string }>();
  const initialBook: Book | null = bookString ? JSON.parse(bookString) : null;

  const [book, setBook] = useState<Book | null>(initialBook);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchBookDetails = async () => {
        if (!initialBook?.id) {
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const response = await api.get('/books');
          const latestBook = response.data.find((b: Book) => b.id === initialBook.id);
          if (latestBook) {
            setBook(latestBook);
          } else {
            Alert.alert('ไม่พบข้อมูล', 'หนังสือเล่มนี้อาจถูกลบไปแล้ว', [{ text: 'ตกลง', onPress: () => router.back() }]);
          }
        } catch (error) {
          console.error('Failed to fetch book details:', error);
          Alert.alert('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลล่าสุดของหนังสือได้');
        } finally {
          setLoading(false);
        }
      };
      fetchBookDetails();
    }, [initialBook?.id, router])
  );
  
  if (loading || !book) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  const getStatusInfo = (status: Book['status']) => {
    switch (status) {
      case 'not_read': return { color: '#FFE4B5', textColor: '#D2691E', icon: '⭐', label: 'ยังไม่ได้อ่าน' };
      case 'reading': return { color: '#E6F3FF', textColor: '#1E90FF', icon: '📖', label: 'กำลังอ่าน' };
      case 'finished': return { color: '#E8F5E8', textColor: '#228B22', icon: '✅', label: 'อ่านจบแล้ว' };
      default: return { color: '#F5F5F5', textColor: '#666666', icon: '📚', label: 'ไม่ระบุ' };
    }
  };

  const statusInfo = getStatusInfo(book.status);

  const handleStatusChange = () => {
    const statusOptions: { label: string; value: Book['status'] }[] = [
      { label: 'ยังไม่ได้อ่าน', value: 'not_read' },
      { label: 'กำลังอ่าน', value: 'reading' },
      { label: 'อ่านจบแล้ว', value: 'finished' }
    ];

    Alert.alert(
      'เปลี่ยนสถานะ',
      'เลือกสถานะใหม่สำหรับหนังสือเล่มนี้',
      [
        ...statusOptions.map(option => ({
          text: option.label,
          onPress: async () => {
            try {
              const updatedBookData = { ...book, status: option.value };
              await api.put(`/books/${book.id}`, updatedBookData);
              setBook(updatedBookData);
              Alert.alert('อัปเดตสำเร็จ', `เปลี่ยนสถานะเป็น "${option.label}" แล้ว`);
            } catch (error) {
              console.error('Failed to update status:', error);
              Alert.alert('ผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้');
            }
          }
        })),
        { text: 'ยกเลิก', style: 'cancel' }
      ]
    );
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด',
      `${book.title} ${isFavorite ? 'ถูกลบจาก' : 'ถูกเพิ่มใน'}รายการโปรดแล้ว`
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.bookIconContainer}>
            <View style={[styles.bookIcon, { backgroundColor: statusInfo.color }]}>
              <ThemedText style={styles.bookIconText}>{statusInfo.icon}</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.favoriteButton, { backgroundColor: isFavorite ? '#FF6B6B' : '#FFFFFF' }]}
              onPress={handleAddToFavorites}
            >
              <ThemedText style={styles.favoriteIcon}>
                {isFavorite ? '❤️' : '🤍'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Book Title & Author */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.bookTitle}>{book.title}</ThemedText>
          <ThemedText style={styles.bookAuthor}>โดย {book.author}</ThemedText>
          
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <ThemedText style={[styles.statusText, { color: statusInfo.textColor }]}>
              {statusInfo.icon} {statusInfo.label}
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleStatusChange}
          >
            <ThemedText style={styles.primaryButtonText}>🔄 เปลี่ยนสถานะ</ThemedText>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => router.push({ pathname: '/(tabs)/ManageBookScreen', params: { bookToEdit: JSON.stringify(book) }})}
            >
              <ThemedText style={styles.secondaryButtonText}>✏️ แก้ไข</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>📝 เพิ่มโน๊ต</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9C3',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: '#F4E99B',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  bookIconContainer: {
    position: 'relative',
  },
  bookIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bookIconText: {
    fontSize: 32,
  },
  favoriteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#A0522D',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4E99B',
  },
  infoLabel: {
    fontSize: 14,
    color: '#A0522D',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#D4A574',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4A574',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4A574',
  },
  bottomPadding: {
    height: 20,
  },
});
