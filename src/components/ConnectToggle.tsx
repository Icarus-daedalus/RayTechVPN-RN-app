import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const CONTAINER_WIDTH = 168;
const KNOB_SIZE = 60;
const PADDING = 6;
const KNOB_TRAVEL = CONTAINER_WIDTH - KNOB_SIZE - PADDING * 2;

export function ConnectToggle() {
  const theme = useAppStore((s) => s.theme);
  const vpnConnected = useAppStore((s) => s.vpnConnected);
  const toggleVpn = useAppStore((s) => s.toggleVpn);
  const tk = t(theme);

  const offset = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    offset.value = withTiming(vpnConnected ? KNOB_TRAVEL : 0, { duration: 260 });
    glowOpacity.value = withTiming(vpnConnected ? 1 : 0, { duration: 350 });

    if (vpnConnected) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.45, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        false
      );
    } else {
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [vpnConnected]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  // Pill background: soft mint when off, warm cream when on
  const containerBg = vpnConnected
    ? theme === 'light'
      ? 'rgba(255,248,195,0.85)'
      : 'rgba(255,215,0,0.18)'
    : theme === 'light'
    ? 'rgba(255,255,255,0.70)'
    : 'rgba(255,255,255,0.10)';

  const containerBorder = vpnConnected
    ? 'rgba(255,215,0,0.30)'
    : theme === 'light'
    ? 'rgba(255,255,255,0.55)'
    : 'rgba(255,255,255,0.10)';

  const statusColor = vpnConnected
    ? theme === 'light' ? '#1e293b' : '#f1f5f9'
    : theme === 'light' ? '#64748b' : '#94a3b8';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={toggleVpn}
        activeOpacity={0.9}
        style={[
          styles.container,
          { backgroundColor: containerBg, borderColor: containerBorder },
        ]}
      >
        {/* Soft glow when connected */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.glow,
            glowStyle,
          ]}
        />

        {/* Knob */}
        <Animated.View style={[styles.knob, knobStyle]}>
          <LinearGradient
            colors={['#FFE234', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Pulse layer */}
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.pulse, pulseStyle]}
          />
          <Zap
            size={26}
            color="#1a1a1a"
            fill={vpnConnected ? '#1a1a1a' : 'transparent'}
            strokeWidth={2.5}
          />
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.status, { color: statusColor }]}>
        {vpnConnected ? 'Подключено' : 'Отключено'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 24,
    marginTop: 40,
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
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  glow: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    zIndex: 1,
  },
  pulse: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  status: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
