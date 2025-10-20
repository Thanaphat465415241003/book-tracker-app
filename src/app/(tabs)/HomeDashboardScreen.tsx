import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/* ---------- Theme ---------- */
const palette = {
  bg: '#FBE9A6',          // เหลืองนวลพื้นหลัง
  headerBar: '#ebcc69ff', // สีแถบบน
  card: '#FFFFFF',
  cardShadow: '#00000022',
  textStrong: '#6B3F1D',
  text: '#8F6B49',
  chip: '#FFF6DC',
  accent: '#D4A574',
  progressBg: '#F3E4CE',
  progressFill: '#D4A574',
  thumbBg: '#FFF2D9',
};

/* =================== Screen =================== */
export default function HomeDashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      {/* ให้ status bar เป็นสีเดียวกับหัว */}
      <StatusBar barStyle="dark-content" backgroundColor={palette.headerBar} />
      {/* อุดสีพื้นที่ status bar (iOS/Android) */}
      <View style={[styles.topInsetFill, { height: insets.top }]} />

      {/* Header โค้งเฉพาะด้านล่าง (อยู่นอก ScrollView) */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <View style={styles.headerWrap}>
          <View style={[styles.headerBar, { paddingTop: insets.top ? 10 : 14 }]}>
            <View style={styles.headerRow}>
              <View style={styles.headerIconRound}>
                <Ionicons name="stats-chart-outline" size={18} color={palette.textStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Reading Dashboard</Text>
                <Text style={styles.headerSub}>ติดตามความคืบหน้าและสถิติการอ่านของคุณ</Text>
              </View>
            </View>

            {/* Chips ฟิลเตอร์เล็ก ๆ เพิ่มชีวิตชีวา (ตัวอย่าง) */}
            
          </View>
        </View>
      </SafeAreaView>

      {/* เนื้อหาเลื่อน */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} overScrollMode="never">
        {/* สรุป 4 การ์ดไล่สี */}
        <View style={styles.statStack}>
          <GradientStat number="127" label="หนังสือที่อ่านแล้ว" icon="book-outline" />
          <GradientStat number="3" label="กำลังอ่าน" icon="person-outline" />
          <GradientStat number="42" label="ชั่วโมงในสัปดาห์นี้" icon="time-outline" />
          <GradientStat number="15" label="วันติดต่อกัน" icon="flame-outline" />
        </View>

        {/* กำลังอ่านอยู่ */}
        <Card title="📖 หนังสือที่กำลังอ่าน">
          <ReadingItem title="ราชาน้ำเงิน" author="หวง เฉ" progress={75} />
          <ReadingItem title="ราชาน้ำเงิน" author="หวง เฉ" progress={50} />
          <ReadingItem title="ราชาน้ำเงิน" author="หวง เฉ" progress={33} />
        </Card>

        {/* สถิติรายเดือน (กราฟแท่งอย่างง่าย) */}
        <Card title="📊 สถิติการอ่านรายเดือน">
          <MiniBarChart
            data={[6, 11, 12, 8, 9]}
            labels={['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.']}
            barColor="#6A83F7"
          />
        </Card>

        {/* เวลาการอ่านรายวัน (กราฟเส้นอย่างง่าย) */}
        <Card title="⏱️ เวลาการอ่านรายวัน">
          <MiniLineChart
            data={[2.0, 3.0, 2.5, 3.6, 2.9, 3.8, 3.2]}
            labels={['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.']}
            lineColor="#7B5CF7"
            dotColor="#7B5CF7"
          />
        </Card>

        {/* เป้าหมายการอ่าน */}
        <Card title="🎯 เป้าหมายการอ่าน">
          <GoalRow title="เป้าหมายรายปี: อ่าน 52 เล่ม" sub="32/52 เล่ม (61% สำเร็จ)" ok />
          <GoalRow title="เป้าหมายรายเดือน: อ่าน 4 เล่ม" sub="3/4 เล่ม (75% สำเร็จ)" ok />
          <GoalRow title="อ่านติดต่อกัน 30 วัน" sub="15/30 วัน (50% สำเร็จ)" ok={false} />
        </Card>

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

/* =================== Components =================== */

function Chip({
  icon,
  label,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <View
      style={[
        styles.chip,
        active && { backgroundColor: '#FFE8B9', borderColor: palette.accent },
      ]}
    >
      <Ionicons
        name={icon}
        size={14}
        color={active ? palette.textStrong : palette.text}
        style={{ marginRight: 6 }}
      />
      <Text style={[styles.chipText, active && { color: palette.textStrong, fontWeight: '800' }]}>
        {label}
      </Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function GradientStat({
  number,
  label,
  icon,
}: {
  number: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
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

function ReadingItem({
  title,
  author,
  progress,
}: {
  title: string;
  author: string;
  progress: number; // 0-100
}) {
  return (
    <View style={styles.readingItem}>
      <View style={styles.thumb}>
        <MaterialCommunityIcons name="book-open-page-variant" size={22} color="#A6683C" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.readingTitle}>{title}</Text>
        <Text style={styles.readingAuthor}>ผู้แต่ง : {author}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>หน้า 225/300 ({progress}%)</Text>
      </View>
    </View>
  );
}

function MiniBarChart({
  data,
  labels,
  barColor,
}: {
  data: number[];
  labels: string[];
  barColor: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <View style={styles.chartBox}>
      <View style={styles.yAxis}>
        {[12, 9, 6, 3, 0].map((v) => (
          <Text key={v} style={styles.axisText}>
            {v}
          </Text>
        ))}
      </View>
      <View style={styles.barArea}>
        {data.map((v, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, { height: (v / max) * 140, backgroundColor: barColor }]} />
            <Text style={styles.xLabel}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MiniLineChart({
  data,
  labels,
  lineColor,
  dotColor,
}: {
  data: number[];
  labels: string[];
  lineColor: string;
  dotColor: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <View style={styles.chartBox}>
      <View style={styles.yAxis}>
        {[4, 3, 2, 1, 0].map((v) => (
          <Text key={v} style={styles.axisText}>
            {v}
          </Text>
        ))}
      </View>
      <View style={[styles.barArea, { alignItems: 'flex-end' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 160 }}>
          {data.map((v, i) => (
            <View key={i} style={styles.lineCol}>
              <View style={[styles.dot, { bottom: (v / max) * 140, backgroundColor: dotColor }]} />
              {i > 0 && (
                <View
                  style={[
                    styles.segment,
                    { bottom: ((data[i - 1] / max) * 140 + (v / max) * 140) / 2 - 1, backgroundColor: lineColor },
                  ]}
                />
              )}
              <Text style={styles.xLabel}>{labels[i]}</Text>
            </View>
          ))}
        </View>
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
          {ok ? 'เป็นไปตามเป้า' : 'ไม่เป็นไปตามเป้า'}
        </Text>
      </View>
    </View>
  );
}

/* =================== Styles =================== */
const styles = StyleSheet.create({
  /* อุดสี status bar */
  topInsetFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: palette.headerBar,
    zIndex: 0,
  },

  /* Header โค้งเฉพาะด้านล่าง */
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

  /* Content */
  content: { padding: 16, gap: 16, paddingBottom: 28 },
  statStack: { gap: 12 },

  gradCard: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00000040',   // iOS shadow
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,               // Android shadow
  },
  gradNumber: { fontSize: 34, fontWeight: '900', color: '#fff' },
  gradLabel: { color: '#fff', fontWeight: '700' },

  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#00000040',   // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,               // Android shadow
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: palette.textStrong, marginBottom: 10 },

  chipsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: palette.chip,
    borderWidth: 1,
    borderColor: '#ECD7B8',
  },
  chipText: { fontSize: 12, color: palette.text, fontWeight: '700' },

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

  /* Charts */
  chartBox: { flexDirection: 'row', paddingTop: 6 },
  yAxis: { width: 28, alignItems: 'flex-end', paddingRight: 6 },
  axisText: { color: '#9c8c79', fontSize: 12, lineHeight: 28 },
  barArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  barCol: { alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  bar: { width: 22, borderRadius: 8 },

  lineCol: { width: 40, alignItems: 'center' },
  dot: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: '#FFF8EA',
  },
  segment: { position: 'absolute', width: 40, height: 2, borderRadius: 1 },
  xLabel: { marginTop: 8, fontSize: 12, color: '#8b7b68' },

  /* Goals */
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
