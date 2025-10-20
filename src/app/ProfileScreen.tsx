import { ThemedText } from '@/components/themed-text';
import React, { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator, //  1. Import เพิ่ม
} from 'react-native';
import api from '@/api/api'; //  2. Import api
import { User } from '@/types/navigation'; //  3. Import User type

export default function ProfileScreen() {
  const router = useRouter();
  //  4. สร้าง State สำหรับเก็บข้อมูลจริงและสถานะ Loading
  const [userProfile, setUserProfile] = useState<Partial<User>>({});
  const [stats, setStats] = useState({ booksRead: 0, currentlyReading: 0, toRead: 0 });
  const [loading, setLoading] = useState(true);

  //  5. ใช้ useFocusEffect เพื่อดึงข้อมูลทุกครั้งที่กลับมาหน้านี้
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // ดึงข้อมูลโปรไฟล์
          const profileRes = await api.get('/users/profile');
          setUserProfile(profileRes.data);

          // ดึงข้อมูลสถิติหนังสือ
          const booksRes = await api.get('/books');
          const books = booksRes.data;
          setStats({
            booksRead: books.filter((b: any) => b.status === 'finished').length,
            currentlyReading: books.filter((b: any) => b.status === 'reading').length,
            toRead: books.filter((b: any) => b.status === 'not_read').length,
          });

        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
            setLoading(false);
        }
      };
      fetchData();
    }, [])
  );
  
  const readingGoal = userProfile.readingGoal || 0;
  const goalProgress = readingGoal > 0 ? Math.min(100, Math.round((stats.booksRead / readingGoal) * 100)) : 0;
  
  //  6. แสดง Loading Indicator ขณะรอข้อมูล
  if (loading) {
      return (
          <View style={[styles.container, styles.loadingContainer]}>
              <ActivityIndicator size="large" color="#D4A574" />
          </View>
      )
  }

  //  7. อัปเดต UI ให้แสดงข้อมูลจาก State
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {userProfile.name?.charAt(0).toUpperCase() || 'U'}
              </ThemedText>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <ThemedText style={styles.userName}>{userProfile.name || 'User'}</ThemedText>
            <ThemedText style={styles.userEmail}>{userProfile.email || ''}</ThemedText>
            {userProfile.memberSince && 
                <ThemedText style={styles.memberSince}>
                    สมาชิกตั้งแต่ {userProfile.memberSince}
                </ThemedText>
            }
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
          <ThemedText style={styles.sectionTitle}>เป้าหมายการอ่าน</ThemedText>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText style={styles.progressNumber}>
                {stats.booksRead}/{readingGoal}
              </ThemedText>
              <ThemedText style={styles.progressLabel}>เล่ม</ThemedText>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${goalProgress}%` }]} />
              </View>
              <ThemedText style={styles.progressPercentage}>
                {goalProgress}%
              </ThemedText>
            </View>
            <ThemedText style={styles.progressDescription}>
                {readingGoal > 0 && stats.booksRead < readingGoal
                ? `เหลืออีก ${readingGoal - stats.booksRead} เล่ม เพื่อบรรลุเป้าหมาย`
                : 'ยินดีด้วย! คุณทำตามเป้าหมายสำเร็จแล้ว'}
            </ThemedText>
          </View>
        </View>

        {/* Reading Statistics */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>สถิติการอ่าน</ThemedText>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.finishedStatCard]}>
              <ThemedText style={styles.statIcon}>📖</ThemedText>
              <ThemedText style={styles.statNumber}>{stats.booksRead}</ThemedText>
              <ThemedText style={styles.statLabel}>อ่านจบแล้ว</ThemedText>
            </View>
            <View style={[styles.statCard, styles.readingStatCard]}>
              <ThemedText style={styles.statIcon}>📚</ThemedText>
              <ThemedText style={styles.statNumber}>{stats.currentlyReading}</ThemedText>
              <ThemedText style={styles.statLabel}>กำลังอ่าน</ThemedText>
            </View>
            <View style={[styles.statCard, styles.toReadStatCard]}>
              <ThemedText style={styles.statIcon}>⭐</ThemedText>
              <ThemedText style={styles.statNumber}>{stats.toRead}</ThemedText>
              <ThemedText style={styles.statLabel}>รอการอ่าน</ThemedText>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        {(userProfile.location || userProfile.favoriteGenre) &&
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ข้อมูลส่วนตัว</ThemedText>
          <View style={styles.infoCard}>
            {userProfile.location && <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>📍</ThemedText>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>ที่อยู่</ThemedText>
                <ThemedText style={styles.infoValue}>{userProfile.location}</ThemedText>
              </View>
            </View>}
            {userProfile.favoriteGenre && <View style={styles.infoRow}>
              <ThemedText style={styles.infoIcon}>📚</ThemedText>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>ประเภทที่ชอบ</ThemedText>
                <ThemedText style={styles.infoValue}>{userProfile.favoriteGenre}</ThemedText>
              </View>
            </View>}
          </View>
        </View>}

        {/* About Me */}
        {userProfile.bio && <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>เกี่ยวกับฉัน</ThemedText>
          <View style={styles.bioCard}>
            <ThemedText style={styles.bioText}>{userProfile.bio}</ThemedText>
          </View>
        </View>}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/EditProfileScreen')}>
            <ThemedText style={styles.primaryButtonText}>✏️ แก้ไขโปรไฟล์</ThemedText>
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
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
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#8B4513',
      marginBottom: 12,
    },
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
    actionSection: {
      gap: 12,
      marginTop: 20,
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
    bottomPadding: {
      height: 20,
    },
  });