import { useAuth } from '@/context/AuthContext';
import { useGoals } from '@/context/GoalsContext'; // ✅ เพิ่ม
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/** ---------- สีธีม ---------- */
const palette = {
  bg: '#FBE9A6',
  card: '#FFFFFF',
  primary: '#D4A574',
  primaryDark: '#B88759',
  success: '#2EAD5F',
  danger: '#C94D5A',
  textStrong: '#6B3F1D',
  text: '#936246',
  inputBg: '#FFF8EE',
  divider: '#EAD5B6',
  shadow: '#00000022',
  headerBar: '#ebcc69ff',
};

/** ---------- ปุ่มมีอนิเมชันเด้งนุ่ม ๆ ---------- */
function AnimatedButton({
  label,
  icon,
  variant = 'primary',
  onPress,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const colors = useMemo(() => {
    switch (variant) {
      case 'success': return { bg: palette.success, fg: '#fff', border: 'transparent' };
      case 'danger':  return { bg: palette.danger,  fg: '#fff', border: 'transparent' };
      case 'outline': return { bg: 'transparent',   fg: palette.textStrong, border: palette.primary };
      default:        return { bg: palette.primary, fg: '#fff', border: 'transparent' };
    }
  }, [variant]);

  const pressIn = () => {
    Animated.timing(scale, { toValue: 0.96, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 200, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      android_ripple={Platform.OS === 'android' ? { color: variant === 'outline' ? '#00000010' : '#ffffff33' } : undefined}
      style={({ pressed }) => [
        styles.btnBase,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border === 'transparent' ? 'transparent' : colors.border,
          borderWidth: colors.border === 'transparent' ? 0 : 1.5,
          opacity: Platform.OS === 'ios' && pressed ? 0.9 : 1,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }], flexDirection: 'row', alignItems: 'center' }}>
        {icon ? <Ionicons name={icon} size={18} color={colors.fg} style={{ marginRight: 8 }} /> : null}
        <Text style={[styles.btnText, { color: colors.fg }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** ---------- Input พร้อมไอคอน + โฟกัสสวย ๆ ---------- */
function LabeledInput({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.inputWrap, { borderColor: focused ? palette.primary : '#E8D8C6', backgroundColor: palette.inputBg }]}>
      <Ionicons name={icon} size={18} color={focused ? palette.primaryDark : '#B89A81'} style={{ marginHorizontal: 10 }} />
      <TextInput
        style={styles.inputField}
        placeholder={placeholder}
        placeholderTextColor="#b99a82"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType={keyboardType}
      />
    </View>
  );
}

/** ---------- หน้า Settings ---------- */
export default function SettingsScreen() {
  const [displayName, setDisplayName] = useState('นัททา ผู้ชอบอ่านหนังสือ');
  const [backupCode, setBackupCode] = useState('');

  // ✅ เป้าหมายจาก Context + state ของ input
  const { monthlyGoal: savedMonthlyGoal, setMonthlyGoal } = useGoals();
  const [monthlyGoal, setMonthlyGoalInput] = useState('');

  const { signOut } = useAuth();

  // โหลดค่าเป้าหมายที่บันทึกไว้มาใส่ input ตอนเปิดหน้า
  useEffect(() => {
    if (savedMonthlyGoal != null) setMonthlyGoalInput(String(savedMonthlyGoal));
  }, [savedMonthlyGoal]);

  const handleLogout = () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ออกจากระบบ', style: 'destructive', onPress: signOut },
    ]);
  };

  // ✅ บันทึกเป้าหมายจริง
  const handleSaveGoal = () => {
    const n = parseInt((monthlyGoal || '').trim(), 10);
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert('ค่าว่าง/ไม่ถูกต้อง', 'กรุณากรอกจำนวนเล่มเป็นตัวเลขมากกว่า 0');
      return;
    }
    setMonthlyGoal(n); // -> GoalsContext จะ persist (เช่น AsyncStorage)
    Alert.alert('สำเร็จ', `บันทึกเป้าหมายรายเดือน: ${n} เล่มแล้ว`);
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.headerBar} />
      <View style={[styles.topInsetFill, { height: insets.top }]} />

      <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
        <View style={styles.headerWrap}>
          <View style={[styles.headerBar, { paddingTop: insets.top ? 10 : 14 }]}>
            <View style={styles.headerRow}>
              <View style={styles.headerIconRound}>
                <Ionicons name="settings-outline" size={18} color={palette.textStrong} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>การตั้งค่า</Text>
                <Text style={styles.headerSub}>ปรับแต่งบัญชีและเป้าหมายการอ่านของคุณ</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.card}>
          {/* ผู้ใช้ */}
          <SectionTitle icon="person-circle-outline" title="การตั้งค่าผู้ใช้" />
          <Text style={styles.label}>เปลี่ยนชื่อผู้ใช้</Text>
          <LabeledInput
            icon="id-card-outline"
            placeholder="กรอกชื่อที่ต้องการแสดง"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <AnimatedButton variant="primary" icon="save-outline" label="บันทึกชื่อผู้ใช้" onPress={() => {}} />

          <Divider />

          {/* รหัสสำรอง */}
          <SectionTitle icon="key-outline" title="รหัสสำรอง" />
          <Text style={styles.label}>เพิ่มรหัสสำรอง (เช่น 4 ตัวอักษร)</Text>
          <LabeledInput icon="lock-closed-outline" placeholder="เช่น AB12" value={backupCode} onChangeText={setBackupCode} />
          <AnimatedButton variant="outline" icon="add-outline" label="เพิ่มรหัสสำรอง" onPress={() => {}} />

          <Divider />

          {/* เป้าหมายการอ่าน */}
          <SectionTitle icon="book-outline" title="เป้าหมายการอ่าน" />
          <Text style={styles.label}>
            เป้าหมายรายเดือน (จำนวนเล่ม){' '}
            {savedMonthlyGoal != null ? `• ปัจจุบัน: ${savedMonthlyGoal} เล่ม` : ''}
          </Text>
          <LabeledInput
            icon="calendar-outline"
            placeholder="จำนวนเล่ม/เดือน"
            value={monthlyGoal}
            onChangeText={setMonthlyGoalInput}
            keyboardType="numeric"
          />
          <AnimatedButton
            variant="success"
            icon="checkmark-circle-outline"
            label="บันทึกเป้าหมาย"
            onPress={handleSaveGoal}
          />

          <Divider />

          {/* จัดการข้อมูล */}
          <SectionTitle icon="server-outline" title="จัดการข้อมูล" />
          <View style={styles.rowButtons}>
            <AnimatedButton variant="outline" icon="refresh-outline" label="รีเซ็ตสถิติ" onPress={() => {}} />
            <AnimatedButton variant="danger" icon="trash-outline" label="ลบบัญชี" onPress={() => {}} />
          </View>
          <AnimatedButton variant="danger" icon="log-out-outline" label="ออกจากระบบ" onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}

/** ---------- ชิ้นส่วนย่อย ---------- */
function SectionTitle({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.sectionRow}>
      <Ionicons name={icon} size={18} color={palette.textStrong} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}
function Divider() {
  return <View style={styles.divider} />;
}

/** ---------- สไตล์รวม ---------- */
const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 28 },

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
    shadowColor: palette.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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

  card: {
    backgroundColor: palette.card,
    padding: 16,
    borderRadius: 18,
    elevation: 3,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 8 },
  sectionTitle: { fontWeight: '900', color: palette.textStrong },
  sectionLine: { flex: 1, height: 1, backgroundColor: palette.divider, marginLeft: 8, opacity: 0.7 },

  label: { color: palette.text, marginBottom: 6 },

  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, marginBottom: 10 },
  inputField: { flex: 1, paddingVertical: 12, paddingRight: 12, color: palette.textStrong, fontWeight: '600' },

  divider: { height: 1, backgroundColor: palette.divider, marginVertical: 14, opacity: 0.6 },

  rowButtons: { flexDirection: 'row', gap: 10, marginBottom: 10 },

  btnBase: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnText: { fontWeight: '900' },
});
