import React from 'react';
import { useColorScheme, View, ViewProps } from 'react-native';
import { Colors } from '../constants/theme';

export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return <View {...props} style={[{ backgroundColor: theme.background }, style]} />;
};
