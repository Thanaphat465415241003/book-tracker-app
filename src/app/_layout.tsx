import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(auth)/login" screenOptions={{ headerShown: false }}>
        {/* Stack group auth */}
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />

        {/* Stack group main */}
        <Stack.Screen name="(tabs)/_layout" />

        {/* Modal / Detail */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="BookDetail" options={{ title: 'รายละเอียดหนังสือ' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
