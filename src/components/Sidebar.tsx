import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import {
  User,
  ShieldCheck,
  Settings,
  X,
  Crown,
  Check,
  Zap,
  Mail,
  Share2,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const { width: W, height: H } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(W * 0.80, 320);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Subscription Sheet ─────────────────────────────────────────────────────
function SubscriptionSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const [selectedPlan, setSelectedPlan] = useState(1);

  const translateY = useSharedValue(H);
  const startY = useSharedValue(0);
  const backdropAlpha = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      backdropAlpha.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(H, { duration: 280 });
      backdropAlpha.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      translateY.value = startY.value + e.translationY;
    })
    .onEnd((e) => {
      'worklet';
      const shouldCloseDown = e.translationY > 80 || e.velocityY > 500;
      const shouldCloseUp = e.translationY < -80 || e.velocityY < -500;

      if (shouldCloseDown) {
        translateY.value = withTiming(H, { duration: 280 });
        backdropAlpha.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else if (shouldCloseUp) {
        translateY.value = withTiming(-H, { duration: 280 });
        backdropAlpha.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, { duration: 260 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAlpha.value,
  }));

  const plans = [
    { period: '1 месяц', price: '250 ₽' },
    { period: '3 месяца', price: '625 ₽' },
    { period: '6 месяцев', price: '1 250 ₽' },
    { period: 'Год', price: '2 500 ₽' },
  ];

  const features = [
    'Безлимитный высокоскоростной трафик',
    'Доступ к премиум-серверам по всему миру',
    'Приоритетная поддержка 24/7',
    'Без рекламы и ограничений',
    'Защита до 5 устройств одновременно',
    'Kill Switch и Split Tunneling',
  ];

  const cardBg =
    theme === 'light'
      ? 'rgba(255,255,255,0.96)'
      : 'rgba(26,26,36,0.97)';

  return (
    <>
      {visible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 80 },
            backdropStyle,
          ]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.subSheet,
          {
            backgroundColor: cardBg,
            borderColor: tk.cardBorder,
            zIndex: 90,
          },
          sheetStyle,
        ]}
      >
        {/* Handle */}
        <GestureDetector gesture={pan}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={1}
            style={styles.subHandle}
          >
            <View style={[styles.handleBar, { backgroundColor: tk.dragHandle }]} />
          </TouchableOpacity>
        </GestureDetector>

        {/* Header */}
        <ScrollView
          contentContainerStyle={styles.subScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Crown badge */}
          <View style={styles.crownWrap}>
            <View style={styles.crownBg}>
              <LinearGradient
                colors={['#FFD700', '#FFC700', '#FFB700']}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
              <Crown size={38} color="#000" />
            </View>
            <View style={styles.crownBadge}>
              <Zap size={12} color="white" fill="white" />
            </View>
          </View>

          <Text style={[styles.premiumTitle, { color: tk.text }]}>
            Премиум подписка
          </Text>
          <Text style={[styles.premiumSub, { color: tk.textSecondary }]}>
            Получите полный доступ ко всем функциям
          </Text>

          {/* Features */}
          <View
            style={[
              styles.featuresCard,
              {
                backgroundColor:
                  theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)',
              },
            ]}
          >
            {features.map((feat, i) => (
              <View key={i} style={[styles.featRow, i !== features.length - 1 && { marginBottom: 12 }]}>
                <View style={styles.checkCircle}>
                  <Check size={13} color="#000" strokeWidth={3} />
                </View>
                <Text style={[styles.featText, { color: tk.text }]}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansWrap}>
            {plans.map((plan, i) => {
              const active = selectedPlan === i;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedPlan(i)}
                  activeOpacity={0.85}
                  style={[
                    styles.planCard,
                    {
                      borderColor: active ? tk.primary : tk.divider,
                      backgroundColor: active
                        ? theme === 'light'
                          ? 'rgba(255,249,230,1)'
                          : 'rgba(42,36,22,1)'
                        : theme === 'light'
                        ? '#FFFFFF'
                        : 'rgba(255,255,255,0.04)',
                      borderWidth: active ? 2 : 1.5,
                    },
                  ]}
                >
                  <Text style={[styles.planPeriod, { color: tk.text }]}>
                    {plan.period}
                  </Text>
                  <Text style={[styles.planPrice, { color: tk.text }]}>
                    {plan.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Subscribe button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              styles.subscribeBtn,
              { shadowColor: tk.primary },
            ]}
          >
            <Text style={styles.subscribeBtnText}>Оформить подписку</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
}

// ─── Main Sidebar ────────────────────────────────────────────────────────────
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const [showSubscription, setShowSubscription] = useState(false);

  const sideX = useSharedValue(-SIDEBAR_WIDTH);
  const backdropAlpha = useSharedValue(0);

  useEffect(() => {
    sideX.value = withTiming(isOpen ? 0 : -SIDEBAR_WIDTH, { duration: 280 });
    backdropAlpha.value = withTiming(isOpen ? 1 : 0, { duration: 280 });
  }, [isOpen]);

  const sideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sideX.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAlpha.value,
  }));

  function navAndClose(path: string) {
    onClose();
    setTimeout(() => router.push(path as any), 300);
  }

  const menuItems = [
    {
      icon: <User size={20} color={tk.text} />,
      label: 'Профиль',
      onPress: () => navAndClose('/profile'),
    },
    {
      icon: <ShieldCheck size={20} color="#B8860B" />,
      label: 'Статус подписки',
      value: 'Премиум',
      valueCls: '#B8860B',
      onPress: () => setShowSubscription(true),
    },
    {
      icon: <Settings size={20} color={tk.text} />,
      label: 'Настройки',
      onPress: () => navAndClose('/settings'),
    },
    {
      icon: <Mail size={20} color={tk.text} />,
      label: 'Связаться с нами',
      onPress: () => {},
    },
    {
      icon: <Share2 size={20} color={tk.text} />,
      label: 'Пригласить друга',
      onPress: () => {},
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 60 },
            backdropStyle,
          ]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
      )}

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: 'transparent',
            borderRightColor: tk.surfaceBorder,
            width: SIDEBAR_WIDTH,
            zIndex: 70,
          },
          sideStyle,
        ]}
      >
        <BlurView
          intensity={theme === 'light' ? 80 : 65}
          tint={theme === 'light' ? 'light' : 'dark'}
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: tk.sidebarBg }]} />

        {/* Profile header */}
        <View style={styles.profileHeader}>
          <Text style={[styles.menuTitle, { color: tk.text }]}>Меню</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: tk.surface }]}
          >
            <X size={18} color={tk.text} />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              activeOpacity={0.8}
              style={[
                styles.menuItem,
                { backgroundColor: 'transparent' },
              ]}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[styles.menuItemLabel, { color: tk.text }]}>
                  {item.label}
                </Text>
              </View>
              {item.value && (
                <Text
                  style={[styles.menuItemValue, { color: item.valueCls }]}
                >
                  {item.value}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { borderTopColor: tk.divider },
          ]}
        >
          <Text style={[styles.version, { color: tk.textSecondary }]}>
            RayTechVPN v1.0.0
          </Text>
        </View>
      </Animated.View>

      {/* Subscription Sheet */}
      <SubscriptionSheet
        visible={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 10, height: 0 },
    elevation: 20,
    paddingTop: 48,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  menuTitle: { fontSize: 24, fontWeight: '600' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: { paddingHorizontal: 12, gap: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  version: {
    fontSize: 14,
    fontWeight: '600',
  },
  // ─── Subscription Sheet ───
  subSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 1,
    maxHeight: H * 0.92,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -8 },
    elevation: 25,
  },
  subHandle: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  subHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  subScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  crownWrap: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 4,
  },
  crownBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  premiumSub: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featText: { fontSize: 14, flex: 1 },
  plansWrap: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  planPeriod: { fontSize: 16, fontWeight: '600' },
  planPrice: { fontSize: 16, fontWeight: '700' },
  subscribeBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  subscribeBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
});
