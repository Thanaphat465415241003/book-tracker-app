// app/(auth)/register.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import api from '@/api/api'; // 👈 1. Import api instance

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  // 👇 2. แก้ไขฟังก์ชัน handleRegister ทั้งหมด
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      // 3. ส่ง request ไปยัง Backend API
      const response = await api.post('/users/register', { email, password });

      if (response.data && response.data.token) {
        // 4. บันทึก Token แล้วนำทางไปหน้า Home
        await AsyncStorage.setItem('userToken', response.data.token);
        router.replace(`/(tabs)/HomeScreen`);
      }
    } catch (error: any) {
      // 5. จัดการ Error กรณีสมัครไม่สำเร็จ (เช่น อีเมลซ้ำ)
      console.error(error.response?.data || error.message);
      Alert.alert(
        'สมัครสมาชิกไม่สำเร็จ', 
        error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      );
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>สมัครสมาชิก</Text>
            <Text style={styles.subtitle}>สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>อีเมล</Text>
              <TextInput
                style={styles.input}
                placeholder="กรุณากรอกอีเมลของคุณ"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>รหัสผ่าน</Text>
              <TextInput
                style={styles.input}
                placeholder="กรุณากรอกรหัสผ่าน"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ยืนยันรหัสผ่าน</Text>
              <TextInput
                style={styles.input}
                placeholder="กรุณายืนยันรหัสผ่าน"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>สมัครสมาชิก</Text>
            </TouchableOpacity>
            
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                โดยการสมัครสมาชิก คุณยอมรับ
              </Text>
              <Text style={styles.termsLink}>เงื่อนไขการใช้งาน</Text>
            </View>
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>มีบัญชีอยู่แล้ว?</Text>
            <TouchableOpacity onPress={() => router.push(`./login`)}>
              <Text style={styles.link}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FEF9C3',
  },
  container: { 
    flex: 1,
    minHeight: '100%',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 380,
    alignSelf: 'center',
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 20,
  },
  title: { 
    fontSize: 36, 
    fontWeight: '800', 
    color: '#f6ae5cff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(246, 174, 92, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 36,
    marginBottom: 30,
    shadowColor: '#f6ae5cff',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(246, 174, 92, 0.1)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5D4E37',
    marginBottom: 12,
    marginLeft: 4,
  },
  input: { 
    borderWidth: 2, 
    borderColor: 'rgba(246, 174, 92, 0.2)', 
    backgroundColor: '#FEFDFB',
    padding: 18, 
    borderRadius: 16, 
    fontSize: 16,
    color: '#2D1B12',
    fontWeight: '500',
    shadowColor: '#f6ae5cff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  button: { 
    backgroundColor: '#f6ae5cff', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 16,
    shadowColor: '#f6ae5cff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: '800', 
    fontSize: 17,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 13,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  termsLink: {
    fontSize: 13,
    color: '#f6ae5cff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
    marginTop: 20,
  },
  footerText: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '500',
  },
  link: { 
    color: '#f6ae5cff', 
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(246, 174, 92, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});