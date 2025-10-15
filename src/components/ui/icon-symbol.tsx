import React from 'react';
import { Text, TextStyle } from 'react-native';

type Props = {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const IconSymbol = ({ name, size = 24, color = '#000', style }: Props) => {
  return <Text style={[{ fontSize: size, color }, style]}>{name}</Text>;
};
