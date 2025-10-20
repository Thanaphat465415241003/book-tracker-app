// app/(auth)/login.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import api from '@/api/api'; //  1. Import api instance ที่เราสร้างไว้

export default function LoginScreen() {
  const [email, setEmail] = useState('');       // เก็บค่า email
  const [password, setPassword] = useState(''); // เก็บค่า password
  const router = useRouter();

  //  2. แก้ไขฟังก์ชัน handleLogin ทั้งหมด
  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลและรหัสผ่าน');
        return;
    }
    
    try {
      // 3. ส่ง request ไปยัง Backend API
      const response = await api.post('/users/login', { email, password });

      if (response.data && response.data.token) {
        // 4. บันทึก Token ที่ได้จาก Backend ลงใน AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.token);
        
        // 5. นำทางไปหน้า Home Screen
        router.replace(`/(tabs)/HomeScreen`);
      }
    } catch (error: any) {
      // 6. จัดการ Error กรณีล็อกอินไม่สำเร็จ
      console.error(error.response?.data || error.message);
      Alert.alert('ล็อกอินไม่สำเร็จ', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>เข้าสู่ระบบ</Text>
          <Text style={styles.subtitle}>ยินดีต้อนรับกลับมา</Text>
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
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>ยังไม่มีบัญชี?</Text>
          <TouchableOpacity onPress={() => router.push(`./register`)}>
            <Text style={styles.link}>สมัครสมาชิก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FEF9C3',
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
    fontSize: 18,
    color: '#8B7355',
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 36,
    marginBottom: 40,
    shadowColor: '#f6ae5c',
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
    marginBottom: 24,
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
    shadowColor: '#f6ae5c',
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
    marginTop: 20,
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