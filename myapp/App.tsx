import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// screens
// ถ้า HomeScreen อยู่ที่ src/app/(tabs)/HomeScreen.tsx
import HomeScreen from '@/app/(tabs)/HomeScreen';
// ถ้า ManageBookScreen อยู่ที่ src/screens/ManageBookScreen.tsx
import ManageBookScreen from '@/app/(tabs)/ManageBookScreen';

import BookDetailScreen from '@/screens/BookDetailScreen';

// types
import { RootStackParamList, RootTabParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 📌 Tab Navigation (Home + Manage)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'book';
          else if (route.name === 'Manage') iconName = 'create';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // ซ่อน header ของ Tab
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'หน้าหลัก' }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageBookScreen}
        options={{ title: 'จัดการหนังสือ' }}
      />
    </Tab.Navigator>
  );
}

// 📌 Stack Navigation (MainTabs + BookDetail)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: 'รายละเอียดหนังสือ' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
