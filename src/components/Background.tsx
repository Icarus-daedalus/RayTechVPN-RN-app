import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const FADE_DURATION = 400;
import Svg, { Path } from 'react-native-svg';
import { useAppStore } from '@/store/useAppStore';

const { width: W, height: H } = Dimensions.get('window');

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// --- Cloud component (light theme) ---
function Cloud({
  style,
  opacity = 1,
}: {
  style?: object;
  opacity?: number;
}) {
  return (
    <View style={[{ opacity }, style]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 230 129"
        preserveAspectRatio="xMidYMid meet"
      >
        <Path
          d="M180.961 84.1049C217.953 125.947 143.469 147.865 141.97 108.015C143.969 97.8863 142.269 77.4301 119.474 76.6331C127.972 76.9302 144.469 90.5805 137.97 108.015C134.971 120.468 102.478 136.408 85.9814 103.532C65.9857 109.509 55.488 100.045 48.9894 94.0674C39.9914 87.0937 17.5962 75.5372 0 85.1012C0.999784 82.1125 7.59836 76.3342 25.9944 77.1312C40.3913 77.755 41.6738 76.1573 46.3912 70.2805L46.49 70.1575C51.6555 61.1913 62.7864 46.4469 65.9857 59.1988C67.9853 63.1838 74.9838 71.2534 86.9812 71.6519C77.4833 68.6632 61.0868 57.7045 71.4846 37.7796C75.817 29.9757 90.7804 16.46 115.975 24.8284C123.973 -1.07394 153.967 -7.54953 167.964 9.38663C153.967 26.8209 160.465 54.7157 190.459 53.7195C160.465 54.7157 148.468 10.3828 188.459 3.90725C205.956 1.07418 230.95 23.8322 214.954 55.712C236.449 67.1688 238.948 113.992 195.458 114.989C196.624 108.015 195.358 92.0749 180.961 84.1049Z"
          fill="white"
          fillOpacity="0.8"
        />
      </Svg>
    </View>
  );
}

// --- Animated cloud wrapper ---
function AnimatedCloud({
  x,
  y,
  width,
  height,
  opacity,
  dxAnim,
  dyAnim,
  duration,
  delay,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  dxAnim: number;
  dyAnim: number;
  duration: number;
  delay: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    tx.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(dxAnim, { duration: duration * 1000 }),
          withTiming(0, { duration: duration * 1000 })
        ),
        -1,
        true
      )
    );
    ty.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(dyAnim, { duration: duration * 1000 }),
          withTiming(0, { duration: duration * 1000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { left: x, top: y, width, height, pointerEvents: 'none' },
        animStyle,
      ]}
    >
      <Cloud opacity={opacity} />
    </Animated.View>
  );
}

// --- Twinkling star ---
function TwinkleStar({
  size,
  top,
  left,
  duration,
  delay,
}: {
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}) {
  const opacity = useSharedValue(0.15);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 500 }),
          withTiming(0.15, { duration: duration * 500 })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration * 500 }),
          withTiming(0.8, { duration: duration * 500 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          top: `${top}%` as unknown as number,
          left: `${left}%` as unknown as number,
          borderRadius: size / 2,
          backgroundColor: 'white',
        },
        animStyle,
      ]}
    />
  );
}

// --- Shooting star ---
function ShootingStar({
  startTop,
  startLeft,
  dx,
  dy,
  tailLen,
  angle,
  duration,
  repeatDelay,
  delay,
}: {
  startTop: number;
  startLeft: number;
  dx: number;
  dy: number;
  tailLen: number;
  angle: number;
  duration: number;
  repeatDelay: number;
  delay: number;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const totalCycle = (duration + repeatDelay) * 1000;
    tx.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(dx, { duration: duration * 1000 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
    ty.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(dy, { duration: duration * 1000 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay * 1000,
      withRepeat(
        withSequence(
          withTiming(0, { duration: duration * 100 }),
          withTiming(1, { duration: duration * 300 }),
          withTiming(1, { duration: duration * 300 }),
          withTiming(0, { duration: duration * 300 }),
          withTiming(0, { duration: repeatDelay * 1000 })
        ),
        -1,
        false
      )
    );
    void totalCycle;
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${angle}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: `${startTop}%` as unknown as number,
          left: `${startLeft}%` as unknown as number,
          width: tailLen,
          height: 2,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.7)',
        },
        animStyle,
      ]}
    />
  );
}

// --- Main Background ---
export function Background() {
  const theme = useAppStore((s) => s.theme);

  const staticStars = useMemo(
    () =>
      [...Array(40)].map((_, i) => ({
        id: i,
        size: seededRand(i * 3) * 2 + 1,
        top: seededRand(i * 7) * 100,
        left: seededRand(i * 11) * 100,
        opacity: seededRand(i * 13) * 0.4 + 0.3,
      })),
    []
  );

  const twinkleStars = useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        size: seededRand(i * 5 + 100) * 2.5 + 1,
        top: seededRand(i * 9 + 100) * 100,
        left: seededRand(i * 17 + 100) * 100,
        duration: seededRand(i * 23 + 100) * 3 + 2,
        delay: seededRand(i * 31 + 100) * 6,
      })),
    []
  );

  const shootingStars = useMemo(
    () =>
      [...Array(6)].map((_, i) => {
        const r = seededRand(i * 41 + 200);
        const r2 = seededRand(i * 43 + 200);
        const r3 = seededRand(i * 47 + 200);
        const r4 = seededRand(i * 53 + 200);
        const r5 = seededRand(i * 59 + 200);
        const r6 = seededRand(i * 61 + 200);
        const r7 = seededRand(i * 67 + 200);
        const startTop = r * 100;
        const startLeft = r2 * 100;
        const dist = r3 * 120 + 80;
        const angleChoices = [115, 120, 125, 130, 135, 140];
        const angle = angleChoices[Math.floor(r4 * angleChoices.length)];
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * dist;
        const dy = Math.sin(rad) * dist;
        const tailLen = r5 * 50 + 30;
        const duration = r6 * 0.7 + 0.5;
        const repeatDelay = r7 * 14 + 4;
        const delay = seededRand(i * 71 + 200) * 15;
        return { id: i, startTop, startLeft, dx, dy, tailLen, angle, duration, repeatDelay, delay };
      }),
    []
  );

  const lightOpacity = useSharedValue(theme === 'light' ? 1 : 0);

  useEffect(() => {
    lightOpacity.value = withTiming(theme === 'light' ? 1 : 0, {
      duration: FADE_DURATION,
    });
  }, [theme]);

  const lightStyle = useAnimatedStyle(() => ({ opacity: lightOpacity.value }));
  const darkStyle = useAnimatedStyle(() => ({ opacity: 1 - lightOpacity.value }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Dark theme — stars */}
      <Animated.View style={[StyleSheet.absoluteFill, darkStyle]}>
        {staticStars.map((s) => (
          <View
            key={s.id}
            style={{
              position: 'absolute',
              width: s.size,
              height: s.size,
              top: `${s.top}%` as unknown as number,
              left: `${s.left}%` as unknown as number,
              borderRadius: s.size / 2,
              backgroundColor: 'white',
              opacity: s.opacity,
            }}
          />
        ))}
        {twinkleStars.map((s) => (
          <TwinkleStar
            key={`tw-${s.id}`}
            size={s.size}
            top={s.top}
            left={s.left}
            duration={s.duration}
            delay={s.delay}
          />
        ))}
        {shootingStars.map((s) => (
          <ShootingStar
            key={`sh-${s.id}`}
            startTop={s.startTop}
            startLeft={s.startLeft}
            dx={s.dx}
            dy={s.dy}
            tailLen={s.tailLen}
            angle={s.angle}
            duration={s.duration}
            repeatDelay={s.repeatDelay}
            delay={s.delay}
          />
        ))}
      </Animated.View>

      {/* Light theme — clouds */}
      <Animated.View style={[StyleSheet.absoluteFill, lightStyle]}>
        <AnimatedCloud
          x={-W * 0.3}
          y={H * 0.08}
          width={250}
          height={140}
          opacity={1}
          dxAnim={20}
          dyAnim={-10}
          duration={15}
          delay={0}
        />
        <AnimatedCloud
          x={W * 0.6}
          y={H * 0.2}
          width={180}
          height={101}
          opacity={0.9}
          dxAnim={-15}
          dyAnim={8}
          duration={12}
          delay={2}
        />
        <AnimatedCloud
          x={-W * 0.15}
          y={H * 0.48}
          width={320}
          height={179}
          opacity={0.8}
          dxAnim={25}
          dyAnim={15}
          duration={20}
          delay={1}
        />
      </Animated.View>
    </View>
  );
}
