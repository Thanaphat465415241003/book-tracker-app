// src/components/haptic-tab.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticTabProps = {
  label: string;
  onPress: () => void;
  isActive?: boolean;
};

export const HapticTab: React.FC<HapticTabProps> = ({ label, onPress, isActive }) => {
  const handlePress = () => {
    Haptics.selectionAsync(); // ให้สั่นแบบเบา ๆ
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={handlePress}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  label: {
    color: '#000',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
  },
});
