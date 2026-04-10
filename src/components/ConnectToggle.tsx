import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const CONTAINER_WIDTH = 160;
const KNOB_SIZE = 56;
const PADDING = 8;
const KNOB_TRAVEL = CONTAINER_WIDTH - KNOB_SIZE - PADDING * 2;

export function ConnectToggle() {
  const theme = useAppStore((s) => s.theme);
  const vpnConnected = useAppStore((s) => s.vpnConnected);
  const toggleVpn = useAppStore((s) => s.toggleVpn);
  const tk = t(theme);

  const offset = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0);
  const statusScale = useSharedValue(1);

  useEffect(() => {
    offset.value = withSpring(vpnConnected ? KNOB_TRAVEL : 0, {
      stiffness: 300,
      damping: 25,
    });
    glowOpacity.value = withTiming(vpnConnected ? 0.3 : 0, { duration: 500 });
    statusScale.value = withSpring(vpnConnected ? 1.05 : 1);

    if (vpnConnected) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [vpnConnected]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      { rotate: `${(offset.value / KNOB_TRAVEL) * 360}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const statusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statusScale.value }],
  }));

  const containerBg = vpnConnected
    ? theme === 'light'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(255,215,0,0.2)'
    : theme === 'light'
    ? 'rgba(0,0,0,0.1)'
    : 'rgba(255,255,255,0.1)';

  const statusColor = vpnConnected
    ? theme === 'light'
      ? '#1e293b'
      : '#f1f5f9'
    : theme === 'light'
    ? '#64748b'
    : '#94a3b8';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={toggleVpn}
        activeOpacity={0.92}
        style={[
          styles.container,
          {
            backgroundColor: containerBg,
            borderColor:
              theme === 'light'
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(255,255,255,0.08)',
          },
        ]}
      >
        {/* Background glow */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.glow,
            { backgroundColor: tk.primary },
            glowStyle,
          ]}
        />

        {/* Knob */}
        <Animated.View style={[styles.knob, knobStyle]}>
          {/* Pulse inside knob */}
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.pulse, pulseStyle]}
          />
          <Zap
            size={26}
            color="#000"
            fill={vpnConnected ? '#000' : 'transparent'}
            strokeWidth={2.5}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.Text style={[styles.status, { color: statusColor }, statusStyle]}>
        {vpnConnected ? 'Подключено' : 'Отключено'}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 20,
    marginTop: 24,
  },
  container: {
    width: CONTAINER_WIDTH,
    height: 72,
    borderRadius: 999,
    padding: PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  glow: {
    borderRadius: 999,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    zIndex: 1,
  },
  pulse: {
    borderRadius: 999,
    backgroundColor: 'white',
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
