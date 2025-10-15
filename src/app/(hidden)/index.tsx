import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* แทน ThemedView / HelloWave ด้วย View */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome!</Text>
        {/* HelloWave แทนด้วย Emoji */}
        <Text style={{ fontSize: 32 }}>👋</Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 1: Try it</Text>
        <Text>
          Edit <Text style={{ fontWeight: '600' }}>app/(tabs)/index.tsx</Text> to see changes.
          Press{' '}
          <Text style={{ fontWeight: '600' }}>
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
          </Text>{' '}
          to open developer tools.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 2: Explore</Text>
        <Text>
          Tap the Explore tab to learn more about what's included in this starter app.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.subtitle}>Step 3: Get a fresh start</Text>
        <Text>
          When you're ready, run <Text style={{ fontWeight: '600' }}>npm run reset-project</Text> 
          to get a fresh app directory.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  stepContainer: { gap: 8, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600' },
});
