import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext'; // ✅ ใช้สำหรับ auth
import { GoalsProvider } from '@/context/GoalsContext'; // ✅ ใช้สำหรับเป้าหมายการอ่าน
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* ✅ ครอบทั้งแอปด้วย Providers ที่ต้องใช้ในหลายหน้า */}
      <AuthProvider>
        <GoalsProvider>
          <Stack initialRouteName="(auth)/login" screenOptions={{ headerShown: false }}>
            {/* กลุ่ม auth */}
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />

            {/* กลุ่มหลัก (แท็บ) */}
            <Stack.Screen name="(tabs)/_layout" />

            {/* หน้าพิเศษ */}
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="BookDetail" options={{ title: 'รายละเอียดหนังสือ' }} />
          </Stack>

          <StatusBar style="auto" />
        </GoalsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
