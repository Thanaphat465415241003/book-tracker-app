// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const theme = {
    bg: '#fffde8',
    active: '#6B3F1D',     // สีเข้มเวลาถูกเลือก
    inactive: '#B57A50',   // สีอ่อนเวลายังไม่ถูกเลือก
    shadow: '#00000020',
    activeBg: '#f3e7cc',   // พื้นหลังปุ่มที่เลือก (อ่อนๆ)
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.active,
        tabBarInactiveTintColor: theme.inactive,
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopWidth: 0,
          elevation: 5,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarItemStyle: { borderRadius: 16, marginHorizontal: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
        // ไฮไลต์พื้นหลังเฉพาะแท็บที่เลือก
        tabBarActiveBackgroundColor: theme.activeBg,
      }}
    >
      {/* 1) หน้าหลัก */}
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={focused ? size + 6 : size + 4}
              color={color}
            />
          ),
        }}
      />

      {/* 2) จัดการหนังสือ */}
      <Tabs.Screen
        name="ManageBookScreen"
        options={{
          title: 'จัดการหนังสือ',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'library' : 'library-outline'}
              size={focused ? size + 6 : size + 4}
              color={color}
            />
          ),
        }}
      />

      {/* 3) สถิติ (HomeDashboardScreen) */}
      <Tabs.Screen
        name="HomeDashboardScreen"
        options={{
          title: 'สถิติ',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'bar-chart-outline'}
              size={focused ? size + 6 : size + 4}
              color={color}
            />
          ),
        }}
      />

      {/* 4) ตั้งค่า */}
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: 'ตั้งค่า',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={focused ? size + 6 : size + 4}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
