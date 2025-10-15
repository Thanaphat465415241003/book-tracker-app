// src/app/(tabs)/explore.tsx
import React from 'react';
import { Image, LayoutAnimation, Platform, StyleSheet, UIManager, useColorScheme } from 'react-native';
import { ExternalLink } from '../../components/external-link';
import ParallaxScrollView from '../../components/parallax-scroll-view';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { Collapsible } from '../../components/ui/collapsible';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { Colors, Fonts } from '../../constants/theme';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ExploreScreen() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={280}
          color={theme.icon}
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded, color: theme.text }}>
          Explore
        </ThemedText>
      </ThemedView>

      <ThemedText style={{ color: theme.text, marginBottom: 16 }}>
        This app includes example code to help you get started.
      </ThemedText>

      {/* Collapsible Sections */}
      <Collapsible title="File-based routing" onToggle={handleToggle}>
        <ThemedText style={{ color: theme.text }}>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText style={{ color: theme.text, marginTop: 4 }}>
          The layout file in{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText> sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Android, iOS, and web support" onToggle={handleToggle}>
        <ThemedText style={{ color: theme.text }}>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Images" onToggle={handleToggle}>
        <ThemedText style={{ color: theme.text }}>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for different screen densities.
        </ThemedText>
        <Image
  source={require('../../../assets/images/react-logo.png')}
  style={styles.image}
/>

        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Light and dark mode components" onToggle={handleToggle}>
        <ThemedText style={{ color: theme.text }}>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect what the user's current color scheme is, and adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Animations" onToggle={handleToggle}>
        <ThemedText style={{ color: theme.text }}>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.OS === 'ios' && (
          <ThemedText style={{ color: theme.text, marginTop: 4 }}>
            The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText> component provides a parallax effect for the header image.
          </ThemedText>
        )}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -80,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 8,
  },
});
