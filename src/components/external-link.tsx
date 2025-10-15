import React, { ReactNode } from 'react';
import { Linking, TouchableOpacity } from 'react-native';

type Props = { href: string; children: ReactNode };

export const ExternalLink = ({ href, children }: Props) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(href)}>
      {children}
    </TouchableOpacity>
  );
};
