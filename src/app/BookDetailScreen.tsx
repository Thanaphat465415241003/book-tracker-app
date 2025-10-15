import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Book } from '@/types/navigation';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BookDetailScreen() {
  // รับ params ที่ส่งมาจาก HomeScreen
  const { book } = useLocalSearchParams<{ book: string }>();

  // parse กลับมาเป็น object
  const parsedBook: Book | null = book ? JSON.parse(book) : null;

  const theme = Colors['light'];

  // Mock data สำหรับข้อมูลเพิ่มเติม
  const [bookDetails, setBookDetails] = useState({
    isbn: '978-0-7352-1129-2',
    pages: 320,
    publisher: 'Avery Publishing',
    publishYear: 2018,
    category: 'Self-Development',
    language: 'English',
    rating: 4.8,
    reviews: 1250,
    dateAdded: '15 ก.ค. 2024',
    dateStarted: parsedBook?.status === 'reading' ? '20 ก.ค. 2024' : null,
    dateFinished: parsedBook?.status === 'finished' ? '5 ส.ค. 2024' : null,
    currentPage: parsedBook?.status === 'reading' ? 156 : null,
    notes: 'หนังสือดีมาก เปลี่ยนวิธีคิดเรื่องการสร้างนิสัยได้จริง',
    tags: ['Productivity', 'Habits', 'Psychology', 'Self-Help']
  });

  const [isFavorite, setIsFavorite] = useState(false);

  if (!parsedBook) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorTitle}>ไม่พบข้อมูลหนังสือ</ThemedText>
        <ThemedText style={styles.errorText}>กรุณาลองใหม่อีกครั้ง</ThemedText>
      </View>
    );
  }

  const getStatusInfo = (status: Book['status']) => {
    switch (status) {
      case 'not_read':
        return { color: '#FFE4B5', textColor: '#D2691E', icon: '⭐', label: 'ยังไม่ได้อ่าน' };
      case 'reading':
        return { color: '#E6F3FF', textColor: '#1E90FF', icon: '📖', label: 'กำลังอ่าน' };
      case 'finished':
        return { color: '#E8F5E8', textColor: '#228B22', icon: '✅', label: 'อ่านจบแล้ว' };
      default:
        return { color: '#F5F5F5', textColor: '#666666', icon: '📚', label: 'ไม่ระบุ' };
    }
  };

  const statusInfo = getStatusInfo(parsedBook.status);

  const handleStatusChange = () => {
    const statusOptions = [
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
          onPress: () => Alert.alert('อัปเดตสำเร็จ', `เปลี่ยนสถานะเป็น "${option.label}" แล้ว`)
        })),
        { text: 'ยกเลิก', style: 'cancel' }
      ]
    );
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด',
      `${parsedBook.title} ${isFavorite ? 'ถูกลบจาก' : 'ถูกเพิ่มใน'}รายการโปรดแล้ว`
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
          <ThemedText style={styles.bookTitle}>{parsedBook.title}</ThemedText>
          <ThemedText style={styles.bookAuthor}>โดย {parsedBook.author}</ThemedText>
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <ThemedText style={[styles.statusText, { color: statusInfo.textColor }]}>
              {statusInfo.icon} {statusInfo.label}
            </ThemedText>
          </View>
        </View>

        {/* Reading Progress (only for reading books) */}
        {parsedBook.status === 'reading' && bookDetails.currentPage && (
          <View style={styles.progressSection}>
            <ThemedText style={styles.sectionTitle}>ความคืบหน้าการอ่าน</ThemedText>
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <ThemedText style={styles.progressNumber}>
                  {bookDetails.currentPage}/{bookDetails.pages}
                </ThemedText>
                <ThemedText style={styles.progressLabel}>หน้า</ThemedText>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[
                    styles.progressBarFill, 
                    { width: `${(bookDetails.currentPage / bookDetails.pages) * 100}%` }
                  ]} />
                </View>
                <ThemedText style={styles.progressPercentage}>
                  {Math.round((bookDetails.currentPage / bookDetails.pages) * 100)}%
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Book Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ข้อมูลหนังสือ</ThemedText>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>📖 จำนวนหน้า</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.pages} หน้า</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>🏢 สำนักพิมพ์</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.publisher}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>📅 ปีที่พิมพ์</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.publishYear}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>📚 หมวดหมู่</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.category}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>🌐 ภาษา</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.language}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>🔢 ISBN</ThemedText>
              <ThemedText style={styles.infoValue}>{bookDetails.isbn}</ThemedText>
            </View>
          </View>
        </View>

        {/* Rating & Reviews */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>คะแนนและรีวิว</ThemedText>
          <View style={styles.ratingCard}>
            <View style={styles.ratingSection}>
              <View style={styles.ratingDisplay}>
                <ThemedText style={styles.ratingNumber}>{bookDetails.rating}</ThemedText>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <ThemedText key={star} style={styles.star}>
                      {star <= Math.floor(bookDetails.rating) ? '⭐' : '☆'}
                    </ThemedText>
                  ))}
                </View>
              </View>
              <ThemedText style={styles.reviewCount}>
                {bookDetails.reviews.toLocaleString()} รีวิว
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Reading Dates */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>วันที่สำคัญ</ThemedText>
          <View style={styles.datesCard}>
            <View style={styles.dateRow}>
              <ThemedText style={styles.dateLabel}>📅 วันที่เพิ่ม</ThemedText>
              <ThemedText style={styles.dateValue}>{bookDetails.dateAdded}</ThemedText>
            </View>
            {bookDetails.dateStarted && (
              <View style={styles.dateRow}>
                <ThemedText style={styles.dateLabel}>📖 วันที่เริ่มอ่าน</ThemedText>
                <ThemedText style={styles.dateValue}>{bookDetails.dateStarted}</ThemedText>
              </View>
            )}
            {bookDetails.dateFinished && (
              <View style={styles.dateRow}>
                <ThemedText style={styles.dateLabel}>✅ วันที่อ่านจบ</ThemedText>
                <ThemedText style={styles.dateValue}>{bookDetails.dateFinished}</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>แท็ก</ThemedText>
          <View style={styles.tagsContainer}>
            {bookDetails.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        {bookDetails.notes && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>บันทึกส่วนตัว</ThemedText>
            <View style={styles.notesCard}>
              <ThemedText style={styles.notesText}>{bookDetails.notes}</ThemedText>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleStatusChange}
          >
            <ThemedText style={styles.primaryButtonText}>🔄 เปลี่ยนสถานะ</ThemedText>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>✏️ แก้ไข</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>📝 เพิ่มโน๊ต</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <ThemedText style={styles.shareButtonText}>📤 แบ่งปัน</ThemedText>
          </TouchableOpacity>
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

  // Error State
  errorContainer: {
    flex: 1,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#A0522D',
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

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Title Section
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

  // Progress Section
  progressSection: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  progressLabel: {
    fontSize: 16,
    color: '#A0522D',
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F4E99B',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4A574',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    minWidth: 40,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
  },

  // Info Card
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

  // Rating Card
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingDisplay: {
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  reviewCount: {
    fontSize: 14,
    color: '#A0522D',
  },

  // Dates Card
  datesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#A0522D',
  },
  dateValue: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#D4A574',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Notes Card
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notesText: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
  },

  // Action Section
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
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F4E99B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },

  bottomPadding: {
    height: 20,
  },
});