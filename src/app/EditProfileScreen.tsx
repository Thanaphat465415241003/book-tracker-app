import { ThemedText } from '@/components/themed-text';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '@/api/api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [readingGoal, setReadingGoal] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [location, setLocation] = useState('');

  // ดึงข้อมูลโปรไฟล์เมื่อเปิดหน้า
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const { data } = await api.get('/users/profile');
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setBio(data.bio || '');
          setBirthDate(data.birthDate || '');
          setReadingGoal(data.readingGoal?.toString() || '');
          setFavoriteGenre(data.favoriteGenre || '');
          setLocation(data.location || '');
        } catch (error) {
          console.error('Failed to fetch profile', error);
          Alert.alert('ผิดพลาด', 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
        }
      };
      fetchProfile();
    }, [])
  );

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อและอีเมล');
      return;
    }
    
    try {
        const profileData = {
            name,
            phone,
            bio,
            birthDate,
            readingGoal: Number(readingGoal) || 0,
            favoriteGenre,
            location
        };
        await api.put('/users/profile', profileData);

        Alert.alert('บันทึกสำเร็จ', 'ข้อมูลโปรไฟล์ของคุณได้รับการบันทึกแล้ว', [
            { text: 'ตกลง', onPress: () => router.back() }
        ]);
    } catch (error) {
        console.error('Failed to update profile', error);
        Alert.alert('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleLogout = async () => {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่หรือไม่?', [
        { text: 'ยกเลิก', style: 'cancel'},
        { text: 'ตกลง', style: 'destructive', onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            router.replace('/(auth)/login');
        }}
    ])
  };

  const handleChangePhoto = () => {
    Alert.alert('เปลี่ยนรูปโปรไฟล์', 'ฟังก์ชันนี้ยังไม่เปิดใช้งาน');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>แก้ไขโปรไฟล์ ✏️</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            ปรับปรุงข้อมูลส่วนตัวของคุณ
          </ThemedText>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>👤</ThemedText>
            </View>
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <ThemedText style={styles.changePhotoText}>📷</ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <ThemedText style={styles.changePhotoLabel}>เปลี่ยนรูปโปรไฟล์</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ข้อมูลส่วนตัว</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>👤 ชื่อ-นามสกุล *</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="กรอกชื่อ-นามสกุล"
              placeholderTextColor="#A0522D"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>📧 อีเมล *</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="กรอกอีเมล"
              placeholderTextColor="#A0522D"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>📱 เบอร์โทร</ThemedText>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="กรอกเบอร์โทรศัพท์"
              placeholderTextColor="#A0522D"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>🎂 วันเกิด</ThemedText>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="วว/ดด/ปปปป"
              placeholderTextColor="#A0522D"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>📍 ที่อยู่</ThemedText>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="กรอกที่อยู่หรือจังหวัด"
              placeholderTextColor="#A0522D"
            />
          </View>
        </View>

        {/* Reading Preferences Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>ความชอบในการอ่าน</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>🎯 เป้าหมายการอ่านต่อปี</ThemedText>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={[styles.input, styles.goalInput]}
                value={readingGoal}
                onChangeText={setReadingGoal}
                placeholder="12"
                placeholderTextColor="#A0522D"
                keyboardType="numeric"
              />
              <ThemedText style={styles.goalUnit}>เล่ม/ปี</ThemedText>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>📚 ประเภทหนังสือที่ชอบ</ThemedText>
            <TextInput
              style={styles.input}
              value={favoriteGenre}
              onChangeText={setFavoriteGenre}
              placeholder="เช่น นิยาย, วิทยาศาสตร์, ประวัติศาสตร์"
              placeholderTextColor="#A0522D"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>✍️ เกี่ยวกับฉัน</ThemedText>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="เขียนเกี่ยวกับตัวเอง เช่น งานอดิเรก ความสนใจ..."
              placeholderTextColor="#A0522D"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Reading Statistics Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>สถิติการอ่าน</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>15</ThemedText>
              <ThemedText style={styles.statLabel}>หนังสือที่อ่านจบ</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>3</ThemedText>
              <ThemedText style={styles.statLabel}>กำลังอ่าน</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>125%</ThemedText>
              <ThemedText style={styles.statLabel}>เป้าหมายปีนี้</ThemedText>
            </View>
          </View>
        </View>

        {/* Account Settings Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>การตั้งค่าบัญชี</ThemedText>
          
          <TouchableOpacity style={styles.settingButton}>
            <ThemedText style={styles.settingButtonText}>🔒 เปลี่ยนรหัสผ่าน</ThemedText>
            <ThemedText style={styles.settingButtonArrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText style={styles.settingButtonText}>🔔 การแจ้งเตือน</ThemedText>
            <ThemedText style={styles.settingButtonArrow}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <ThemedText style={styles.settingButtonText}>🌙 โหมดมืด</ThemedText>
            <ThemedText style={styles.settingButtonArrow}>›</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>💾 บันทึกการเปลี่ยนแปลง</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <ThemedText style={styles.logoutButtonText}>🚪 ออกจากระบบ</ThemedText>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
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

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Profile Photo
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 40,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoText: {
    fontSize: 16,
  },
  changePhotoLabel: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },

  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 16,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#F4E99B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#8B4513',
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInput: {
    flex: 1,
    marginRight: 12,
  },
  goalUnit: {
    fontSize: 14,
    color: '#A0522D',
    fontWeight: '500',
  },

  // Statistics
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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

  // Setting Buttons
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4E99B',
  },
  settingButtonText: {
    fontSize: 16,
    color: '#8B4513',
  },
  settingButtonArrow: {
    fontSize: 20,
    color: '#A0522D',
    fontWeight: 'bold',
  },

  // Action Buttons
  actionButtonsContainer: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#D4A574',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  bottomPadding: {
    height: 20,
  },
});