import 'react-native-gesture-handler';
import '../src/global.css';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Background } from '@/components/Background';
import { useAppStore } from '@/store/useAppStore';

function ThemedBackground() {
  const theme = useAppStore((s) => s.theme);

  if (theme === 'dark') {
    return (
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#8BCCD8' }]} />
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
