import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Crown, Zap, Check } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

const PLANS = [
  { period: '1 месяц', price: '250 ₽' },
  { period: '3 месяца', price: '625 ₽' },
  { period: '6 месяцев', price: '1 250 ₽' },
  { period: 'Год', price: '2 500 ₽' },
];

const FEATURES = [
  'Безлимитный высокоскоростной трафик',
  'Доступ к премиум-серверам по всему миру',
  'Приоритетная поддержка 24/7',
  'Без рекламы и ограничений',
  'Защита до 5 устройств одновременно',
  'Kill Switch и Split Tunneling',
];

export default function SubscriptionScreen() {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState(1);

  const featCardBg =
    theme === 'light' ? '#F8FAFC' : 'rgba(255,255,255,0.05)';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: tk.headerBg,
            borderBottomColor: tk.headerBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={[styles.backBtn, { backgroundColor: tk.btnIconBg }]}
        >
          <ChevronLeft size={22} color={tk.text} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tk.text }]}>Подписка</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Crown badge */}
        <View style={styles.crownWrap}>
          <View style={styles.crownBg}>
            <Crown size={40} color="#000" />
          </View>
          <View style={styles.crownBadge}>
            <Zap size={13} color="white" fill="white" />
          </View>
        </View>

        <Text style={[styles.title, { color: tk.text }]}>Премиум подписка</Text>
        <Text style={[styles.subtitle, { color: tk.textSecondary }]}>
          Получите полный доступ ко всем функциям
        </Text>

        {/* Features card */}
        <View style={[styles.featCard, { backgroundColor: featCardBg }]}>
          {FEATURES.map((feat, i) => (
            <View
              key={i}
              style={[styles.featRow, i !== FEATURES.length - 1 && { marginBottom: 12 }]}
            >
              <View style={styles.checkCircle}>
                <Check size={13} color="#000" strokeWidth={3} />
              </View>
              <Text style={[styles.featText, { color: tk.text }]}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansWrap}>
          {PLANS.map((plan, i) => {
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
                    shadowColor: active ? '#FFD700' : '#000',
                    shadowOpacity: active ? 0.2 : 0.06,
                    shadowRadius: active ? 10 : 3,
                    shadowOffset: { width: 0, height: active ? 2 : 1 },
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
          style={[styles.subscribeBtn, { shadowColor: '#FFD700' }]}
        >
          <Text style={styles.subscribeBtnText}>Оформить подписку</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  crownWrap: { position: 'relative', marginBottom: 4 },
  crownBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
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
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  featCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
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
  plansWrap: { width: '100%', gap: 10 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 2,
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
  subscribeBtnText: { fontSize: 17, fontWeight: '700', color: '#000' },
});
