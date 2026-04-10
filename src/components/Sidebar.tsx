import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
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
  ChevronLeft,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const { width: W, height: H } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(W * 0.82, 320);

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
  const backdropAlpha = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 28, stiffness: 220 });
      backdropAlpha.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withSpring(H, { damping: 28, stiffness: 220 });
      backdropAlpha.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

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
        <View style={styles.subHandle}>
          <View style={[styles.handleBar, { backgroundColor: tk.dragHandle }]} />
        </View>

        {/* Header */}
        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.backBtn, { backgroundColor: tk.btnIconBg }]}
          >
            <ChevronLeft size={22} color={tk.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.subTitle, { color: tk.text }]}>Подписка</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.subScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Crown badge */}
          <View style={styles.crownWrap}>
            <View style={styles.crownBg}>
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
    sideX.value = withSpring(isOpen ? 0 : -SIDEBAR_WIDTH, {
      damping: 30,
      stiffness: 250,
    });
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
            backgroundColor: tk.sidebarBg,
            borderRightColor: tk.surfaceBorder,
            width: SIDEBAR_WIDTH,
            zIndex: 70,
          },
          sideStyle,
        ]}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <User size={24} color="white" />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: tk.text }]}>Alex Ray</Text>
              <Text style={[styles.userEmail, { color: tk.textSecondary }]}>
                alex@raytech.vpn
              </Text>
            </View>
          </View>
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
    paddingTop: Platform.OS === 'android' ? 48 : 56,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  userInfo: { gap: 2 },
  userName: { fontSize: 17, fontWeight: '600' },
  userEmail: { fontSize: 12 },
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
    fontSize: 17,
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
    fontSize: 13,
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
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 22,
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
