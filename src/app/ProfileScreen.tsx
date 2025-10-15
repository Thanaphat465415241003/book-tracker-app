import { ThemedText } from '@/components/themed-text';
import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  // Mock data - ในแอปจริงจะมาจาก state หรือ API
  const userProfile = {
    name: 'อนันต์ วรรณกิจ',
    email: 'anan.wk@example.com',
    memberSince: 'มกราคม 2024',
    location: 'กรุงเทพมหานคร',
    favoriteGenre: 'นิยาย, วิทยาศาสตร์, ประวัติศาสตร์',
    readingGoal: 24,
    bio: 'รักการอ่านหนังสือ เชื่อว่าหนังสือเป็นประตูสู่โลกกว้าง ชอบแบ่งปันความรู้และประสบการณ์การอ่านให้กับคนอื่น'
  };

  const readingStats = {
    booksRead: 18,
    currentlyReading: 3,
    toRead: 12,
    goalProgress: 75,
    favoriteBook: 'Atomic Habits',
    readingStreak: 45
  };

  const achievements = [
    { icon: '🏆', title: 'นักอ่านตัวยง', description: 'อ่านหนังสือ 50 เล่ม' },
    { icon: '📚', title: 'นักสะสม', description: 'มีหนังสือในคลัง 100 เล่ม' },
    { icon: '🔥', title: 'อ่านต่อเนื่อง', description: 'อ่านหนังสือ 30 วันติดต่อกัน' },
    { icon: '⭐', title: 'นักรีวิว', description: 'เขียนรีวิว 25 เรื่อง' }
  ];

  return (
    <View style={styles.container}>
      {/* Header with Profile */}
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>A</ThemedText>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <ThemedText style={styles.userName}>{userProfile.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{userProfile.email}</ThemedText>
            <ThemedText style={styles.memberSince}>
              สมาชิกตั้งแต่ {userProfile.memberSince}
            </ThemedText>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Reading Progress */}
        <View style={styles.progressSection}>
          <ThemedText style={styles.sectionTitle}>เป้าหมายการอ่านปี 2024</ThemedText>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressNumber}>
                {readingStats.booksRead}/{userProfile.readingGoal}
              </ThemedText>
              <ThemedText style={styles.progressLabel}>เล่ม</ThemedText>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${readingStats.goalProgress}%` }]} />
              </View>
              <ThemedText style={styles.progressPercentage}>
                {readingStats.goalProgress}%
              </ThemedText>
            </View>
            <ThemedText style={styles.progressDescription}>
              เหลืออีก {userProfile.readingGoal - readingStats.booksRead} เล่ม เพื่อบรรลุเป้าหมาย
            </ThemedText>
          </View>
        </View>

        {/* Reading Statistics */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>สถิติการอ่าน</ThemedText>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.finishedStatCard]}>
              <ThemedText style={styles.statIcon}>📖</ThemedText>
              <ThemedText style={styles.statNumber}>{readingStats.booksRead}</ThemedText>
              <ThemedText style={styles.statLabel}>อ่านจบแล้ว</ThemedText>
            </View>
            <View style={[styles.statCard, styles.readingStatCard]}>
              <ThemedText style={styles.statIcon}>📚</ThemedText>
              <ThemedText style={styles.statNumber}>{readingStats.currentlyReading}</ThemedText>
              <ThemedText style={styles.statLabel}>กำลังอ่าน</ThemedText>
            </View>
            <View style={[styles.statCard, styles.toReadStatCard]}>
              <ThemedText style={styles.statIcon}>⭐</ThemedText>
              <ThemedText style={styles.statNumber}>{readingStats.toRead}</ThemedText>
              <ThemedText style={styles.statLabel}>รอการอ่าน</ThemedText>
            </View>
            <View style={[styles.statCard, styles.streakStatCard]}>
              <ThemedText style={styles.statIcon}>🔥</ThemedText>
              <ThemedText style={styles.statNumber}>{readingStats.readingStreak}</ThemedText>
              <ThemedText style={styles.statLabel}>วันติดต่อกัน</ThemedText>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ข้อมูลส่วนตัว</ThemedText>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>📍</ThemedText>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>ที่อยู่</ThemedText>
                <ThemedText style={styles.infoValue}>{userProfile.location}</ThemedText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>📚</ThemedText>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>ประเภทที่ชอบ</ThemedText>
                <ThemedText style={styles.infoValue}>{userProfile.favoriteGenre}</ThemedText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>⭐</ThemedText>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>หนังสือโปรด</ThemedText>
                <ThemedText style={styles.infoValue}>{readingStats.favoriteBook}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* About Me */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>เกี่ยวกับฉัน</ThemedText>
          <View style={styles.bioCard}>
            <ThemedText style={styles.bioText}>{userProfile.bio}</ThemedText>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ความสำเร็จ</ThemedText>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <ThemedText style={styles.achievementIcon}>{achievement.icon}</ThemedText>
                <ThemedText style={styles.achievementTitle}>{achievement.title}</ThemedText>
                <ThemedText style={styles.achievementDescription}>
                  {achievement.description}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>กิจกรรมล่าสุด</ThemedText>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <ThemedText style={styles.activityIcon}>📖</ThemedText>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityText}>อ่านจบ "Deep Work" เมื่อ 2 วันที่แล้ว</ThemedText>
                <ThemedText style={styles.activityTime}>2 วันที่แล้ว</ThemedText>
              </View>
            </View>
            <View style={styles.activityItem}>
              <ThemedText style={styles.activityIcon}>⭐</ThemedText>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityText}>เพิ่ม "Clean Code" เข้าสู่รายการ</ThemedText>
                <ThemedText style={styles.activityTime}>5 วันที่แล้ว</ThemedText>
              </View>
            </View>
            <View style={styles.activityItem}>
              <ThemedText style={styles.activityIcon}>🏆</ThemedText>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityText}>ได้รับความสำเร็จ "อ่านต่อเนื่อง"</ThemedText>
                <ThemedText style={styles.activityTime}>1 สัปดาห์ที่แล้ว</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>✏️ แก้ไขโปรไฟล์</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>⚙️ การตั้งค่า</ThemedText>
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

  // Header
  headerContainer: {
    backgroundColor: '#F4E99B',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#D4A574',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#28A745',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A0522D',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: '#A0522D',
    fontStyle: 'italic',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Progress Section
  progressSection: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  progressLabel: {
    fontSize: 18,
    color: '#A0522D',
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    minWidth: 45,
  },
  progressDescription: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'center',
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

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  finishedStatCard: {
    backgroundColor: '#E8F5E8',
  },
  readingStatCard: {
    backgroundColor: '#E6F3FF',
  },
  toReadStatCard: {
    backgroundColor: '#FFE4B5',
  },
  streakStatCard: {
    backgroundColor: '#FFE4E1',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'center',
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
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#A0522D',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },

  // Bio Card
  bioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bioText: {
    fontSize: 16,
    color: '#8B4513',
    lineHeight: 24,
  },

  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#A0522D',
    textAlign: 'center',
  },

  // Activity Card
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#A0522D',
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
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
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