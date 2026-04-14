import 'react-native-gesture-handler';
import '../src/global.css';

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Background } from '@/components/Background';
import { useAppStore } from '@/store/useAppStore';

const FADE_DURATION = 400;

function ThemedBackground() {
  const theme = useAppStore((s) => s.theme);
  const lightOpacity = useSharedValue(theme === 'light' ? 1 : 0);

  useEffect(() => {
    lightOpacity.value = withTiming(theme === 'light' ? 1 : 0, {
      duration: FADE_DURATION,
    });
  }, [theme]);

  const lightStyle = useAnimatedStyle(() => ({
    opacity: lightOpacity.value,
  }));

  return (
    <>
      {/* Dark gradient always underneath */}
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={StyleSheet.absoluteFill}
      />
      {/* Light solid color fades in/out on top */}
      <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#8BCCD8' }]} />
      </Animated.View>
    </>
  );
}

export default function RootLayout() {
  const theme = useAppStore((s) => s.theme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Persistent themed background */}
        <ThemedBackground />
        {/* Animated background layer (stars/clouds) */}
        <Background />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="subscription" />
        </Stack>

        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
