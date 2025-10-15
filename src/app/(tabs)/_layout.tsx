// app/(tabs)/_layout.tsx
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const themeColors = {
    background: '#fffde8', // สีพื้นหลังหลัก
    tabActive: '#D4A574',   // สี active tab
    tabInactive: '#A0522D', // สี inactive tab
    tabShadow: '#00000020', // เงาแถบ
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopWidth: 0,
          elevation: 5,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: themeColors.tabShadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarActiveTintColor: themeColors.tabActive,
        tabBarInactiveTintColor: themeColors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size + 6} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'สำรวจ',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" size={size + 6} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ManageBookScreen"
        options={{
          title: 'จัดการหนังสือ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book" size={size + 6} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
