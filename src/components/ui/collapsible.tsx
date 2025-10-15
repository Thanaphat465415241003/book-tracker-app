// src/components/ui/collapsible.tsx
import React, { ReactNode, useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

type Props = {
  title: string;
  children: ReactNode;
  onToggle?: () => void;
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Collapsible = ({ title, children, onToggle }: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
    if (onToggle) onToggle();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text>{open ? '-' : '+'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#eee' },
  title: { fontWeight: 'bold' },
  content: { padding: 12 },
});
