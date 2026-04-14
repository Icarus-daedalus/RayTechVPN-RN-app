import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const LAUNCHED_KEY = '@raytechvpn:hasLaunched';

const ITEMS = [
  'Мы будем собирать только минимально необходимые данные для предоставления вам безопасного и стабильного VPN-опыта. Для вашего удобства, вот ключевые точки данных, которые мы собираем:',
  'Сбор системного языка используется в основном для установки языка в приложении, но мы не сохраняем ваши данные о системном языке.',
  'Чтобы предоставить вам самый быстрый список серверов по умолчанию, нам требуется ваш IP-адрес и системная страна/регион, но мы не сохраняем эти данные.',
  'Мы строго придерживаемся нашей политики отсутствия логов и соответствующих законов о конфиденциальности данных, и приложим все усилия для защиты вашей конфиденциальности и безопасности.',
];

export default function WelcomeScreen() {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const insets = useSafeAreaInsets();

  const logoY = useSharedValue(-50);
  const logoOpacity = useSharedValue(0);
  const cardY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    AsyncStorage.getItem(LAUNCHED_KEY).then((val) => {
      if (val) {
        router.replace('/home');
        return;
      }
      logoY.value = withTiming(0, { duration: 700 });
      logoOpacity.value = withTiming(1, { duration: 700 });
      cardY.value = withDelay(200, withTiming(0, { duration: 700 }));
      cardOpacity.value = withDelay(200, withTiming(1, { duration: 700 }));
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value }],
    opacity: logoOpacity.value,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  async function handleAccept() {
    await AsyncStorage.setItem(LAUNCHED_KEY, '1');
    router.replace('/home');
  }

  const cardBg =
    theme === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)';
  const cardBorder =
    theme === 'light' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 },
      ]}
    >
      {/* Logo */}
      <Animated.View style={logoStyle}>
        <Logo />
      </Animated.View>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: cardBg, borderColor: cardBorder },
          cardStyle,
        ]}
      >
        <Text style={[styles.greeting, { color: tk.text }]}>
          Спасибо, что выбрали{' '}
          <Text style={{ fontWeight: '700' }}>RayTechVPN</Text>.
        </Text>

        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {ITEMS.map((item, i) => (
            <Text key={i} style={[styles.listText, { color: tk.text }]}>
              {item}
            </Text>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleAccept}
          activeOpacity={0.88}
          style={styles.acceptBtn}
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
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 48,
  },
  card: {
    flex: 1,
    width: '100%',
    maxHeight: 500,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 25 },
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 16,
    lineHeight: 26,
  },
  listContent: {
    gap: 16,
    paddingBottom: 4,
  },
  listText: {
    fontSize: 13,
    lineHeight: 21,
  },
  acceptBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  acceptBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
