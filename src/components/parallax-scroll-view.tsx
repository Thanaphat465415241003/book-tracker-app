import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  headerImage?: ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
  children: ReactNode;
};

export default function ParallaxScrollView({ headerImage, children }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {headerImage && <View>{headerImage}</View>}
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
