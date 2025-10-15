import React from 'react';
import { Text, TextProps, TextStyle, useColorScheme } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

type Props = TextProps & {
  type?: 'default' | 'defaultSemiBold' | 'title' | 'link';
};

export const ThemedText: React.FC<Props> = ({ type = 'default', style, ...props }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  let fontWeight: TextStyle['fontWeight'] = '400';
  if (type === 'defaultSemiBold') fontWeight = '600';
  if (type === 'title') fontWeight = '700';
  if (type === 'link') fontWeight = '400';

  return (
    <Text
      {...props}
      style={[{ fontFamily: Fonts.rounded, color: theme.text, fontWeight }, style]}
    />
  );
};
