import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const ITEMS = [
  'Мы будем собирать только минимально необходимые данные для предоставления вам безопасного и стабильного VPN-опыта.',
  'Сбор системного языка используется в основном для установки языка в приложении, но мы не сохраняем ваши данные о системном языке.',
  'Чтобы предоставить вам самый быстрый список серверов, нам требуется ваш IP-адрес и системная страна/регион, но мы не сохраняем эти данные.',
  'Мы строго придерживаемся нашей политики отсутствия логов и соответствующих законов о конфиденциальности, и приложим все усилия для защиты вашей безопасности.',
];

export default function WelcomeScreen() {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const insets = useSafeAreaInsets();

  // Entrance animations
  const logoY = useSharedValue(-50);
  const logoOpacity = useSharedValue(0);
  const cardY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    logoY.value = withTiming(0, { duration: 700 });
    logoOpacity.value = withTiming(1, { duration: 700 });
    cardY.value = withDelay(200, withTiming(0, { duration: 700 }));
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 700 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value }],
    opacity: logoOpacity.value,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 },
      ]}
    >
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Logo />
      </Animated.View>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: tk.surface,
            borderColor: tk.surfaceBorder,
          },
          cardStyle,
        ]}
      >
        <Text style={[styles.greeting, { color: tk.text }]}>
          Спасибо, что выбрали{' '}
          <Text style={{ fontWeight: '700' }}>RayTechVPN</Text>.
        </Text>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {ITEMS.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.bullet, { backgroundColor: tk.primary }]} />
              <Text style={[styles.listText, { color: tk.text }]}>{item}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.replace('/home')}
          activeOpacity={0.88}
          style={[
            styles.acceptBtn,
            {
              shadowColor: tk.primary,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          <Text style={styles.acceptBtnText}>Согласиться и продолжить</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 32,
  },
  logoWrap: {
    marginTop: 8,
  },
  card: {
    flex: 1,
    width: '100%',
    maxHeight: 520,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 15,
    lineHeight: 22,
  },
  listContent: {
    gap: 14,
    paddingBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  listText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  acceptBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  acceptBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
