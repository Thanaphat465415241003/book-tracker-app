import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import api from '@/api/api';
import { User, Book } from '@/types/navigation';

/* ---------- Theme ---------- */
const palette = {
  bg: '#FBE9A6',
  headerBar: '#ebcc69ff',
  card: '#FFFFFF',
  cardShadow: '#00000022',
  textStrong: '#6B3F1D',
  text: '#8F6B49',
  chip: '#FFF6DC',
  accent: '#D4A574',
  progressBg: '#F3E4CE',
  progressFill: '#D4A574',
  thumbBg: '#FFF2D9',
  primary: '#D4A574',
};

/* =================== Screen =================== */
export default function HomeDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState({
    finished: 0,
    reading: 0,
    readingStreak: 0, // Placeholder
    weeklyHours: 0, // Placeholder
  });
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [profile, setProfile] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล Dashboard จาก API
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [booksRes, profileRes] = await Promise.all([
            api.get('/books'),
            api.get('/users/profile'),
          ]);

          const books: Book[] = booksRes.data;
          const userProfile: User = profileRes.data;
          
          setStats({
            finished: books.filter(b => b.status === 'finished').length,
            reading: books.filter(b => b.status === 'reading').length,
            readingStreak: 0, // คำนวณเพิ่มเติมในอนาคต
            weeklyHours: 0, // คำนวณเพิ่มเติมในอนาคต
          });

          setReadingBooks(books.filter(b => b.status === 'reading'));
          setProfile(userProfile);

        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const goalProgress = (profile.readingGoal && profile.readingGoal > 0) 
    ? Math.min(100, Math.round((stats.finished / profile.readingGoal) * 100))
    : 0;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.bg }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.headerBar} />
      <View style={[styles.topInsetFill, { height: insets.top }]} />

      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <View style={styles.headerWrap}>
          <View style={[styles.headerBar, { paddingTop: insets.top ? 10 : 14 }]}>
            <View style={styles.headerRow}>
              <View style={styles.headerIconRound}>
                <Ionicons name="stats-chart-outline" size={18} color={palette.textStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Reading Dashboard</Text>
                <Text style={styles.headerSub}>สถิติการอ่านของคุณ</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} overScrollMode="never">
        {/* สรุป 4 การ์ดไล่สี */}
        <View style={styles.statStack}>
          <GradientStat number={String(stats.finished)} label="หนังสือที่อ่านแล้ว" icon="book-outline" />
          <GradientStat number={String(stats.reading)} label="กำลังอ่าน" icon="bookmarks-outline" />
          {/* Mock data for now */}
          <GradientStat number="0" label="ชั่วโมงในสัปดาห์นี้" icon="time-outline" />
          <GradientStat number="0" label="วันติดต่อกัน" icon="flame-outline" />
        </View>

        {/* กำลังอ่านอยู่ */}
        {readingBooks.length > 0 && (
            <Card title="📖 หนังสือที่กำลังอ่าน">
                {readingBooks.map(book => (
                    <ReadingItem key={book.id} title={book.title} author={book.author} progress={0} />
                ))}
            </Card>
        )}
        
        {/* เป้าหมายการอ่าน */}
        {profile.readingGoal && profile.readingGoal > 0 && (
            <Card title="🎯 เป้าหมายการอ่าน">
                <GoalRow 
                    title={`เป้าหมายรายปี: อ่าน ${profile.readingGoal} เล่ม`} 
                    sub={`${stats.finished}/${profile.readingGoal} เล่ม (${goalProgress}% สำเร็จ)`} 
                    ok={stats.finished >= profile.readingGoal} 
                />
            </Card>
        )}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

/* =================== Components =================== */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function GradientStat({ number, label, icon }: { number: string; label: string; icon: keyof typeof Ionicons.glyphMap; }) {
  return (
    <LinearGradient
      colors={['#90E8C7', '#55D5A0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradCard}
    >
      <Text style={styles.gradNumber}>{number}</Text>
      <View style={{ height: 6 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name={icon} size={16} color="#fff" />
        <Text style={styles.gradLabel}>{label}</Text>
      </View>
    </LinearGradient>
  );
}

function ReadingItem({ title, author, progress }: { title: string; author: string; progress: number; }) {
  return (
    <View style={styles.readingItem}>
      <View style={styles.thumb}>
        <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#A6683C" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.readingTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.readingAuthor}>ผู้แต่ง : {author}</Text>
        {/* Progress bar is a placeholder for now as we don't track page numbers */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>ความคืบหน้า (เร็วๆ นี้)</Text>
      </View>
    </View>
  );
}

function GoalRow({ title, sub, ok }: { title: string; sub: string; ok: boolean }) {
  return (
    <View style={styles.goalRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.goalTitle}>{title}</Text>
        <Text style={styles.goalSub}>{sub}</Text>
      </View>
      <View style={[styles.goalBadge, ok ? styles.badgeOk : styles.badgeNg]}>
        <Text style={[styles.goalBadgeText, ok ? styles.badgeOkText : styles.badgeNgText]}>
          {ok ? 'สำเร็จ' : 'ยังไม่สำเร็จ'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topInsetFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: palette.headerBar,
    zIndex: 0,
  },
  headerWrap: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: palette.cardShadow,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  headerBar: {
    backgroundColor: palette.headerBar,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconRound: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F8EAD0', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: palette.textStrong },
  headerSub: { color: palette.text, marginTop: 2 },
  content: { padding: 16, gap: 16, paddingBottom: 28 },
  statStack: { gap: 12 },
  gradCard: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00000040',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  gradNumber: { fontSize: 34, fontWeight: '900', color: '#fff' },
  gradLabel: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#00000040',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: palette.textStrong, marginBottom: 10 },
  readingItem: { flexDirection: 'row', gap: 12, paddingVertical: 10, alignItems: 'center' },
  thumb: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: palette.thumbBg, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00000033', shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  readingTitle: { fontWeight: '900', color: palette.textStrong },
  readingAuthor: { color: palette.text, marginTop: 2, marginBottom: 8 },
  progressTrack: { height: 10, backgroundColor: palette.progressBg, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: palette.progressFill },
  progressText: { marginTop: 6, fontSize: 12, color: '#6b6b6b' },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  goalTitle: { fontWeight: '800', color: palette.textStrong },
  goalSub: { color: '#7c6a55', fontSize: 12, marginTop: 2 },
  goalBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  badgeOk: { backgroundColor: '#E6F6EB' },
  badgeNg: { backgroundColor: '#FBE3E6' },
  goalBadgeText: { fontWeight: '800', fontSize: 12 },
  badgeOkText: { color: '#2EAD5F' },
  badgeNgText: { color: '#C94D5A' },
});