import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Globe,
  HelpCircle,
  Mail,
  Info,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';
import { FAQ_ITEMS, LANGUAGES } from '@/constants/faq';

// ─── Accordion Item ───────────────────────────────────────────────────────────
function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
  dividerColor,
  textColor,
  textSub,
  rowBg,
}: {
  item: (typeof FAQ_ITEMS)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  dividerColor: string;
  textColor: string;
  textSub: string;
  rowBg: string;
}) {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const contentHeight = useRef(0);

  function handleLayout(e: LayoutChangeEvent) {
    contentHeight.current = e.nativeEvent.layout.height;
  }

  React.useEffect(() => {
    height.value = withTiming(isOpen ? contentHeight.current || 80 : 0, {
      duration: 260,
    });
    opacity.value = withTiming(isOpen ? 1 : 0, { duration: 220 });
    rotate.value = withTiming(isOpen ? 180 : 0, { duration: 250 });
  }, [isOpen]);

  const answerContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const answerOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={
        index < FAQ_ITEMS.length - 1
          ? [styles.faqItemWrap, { borderBottomColor: dividerColor }]
          : undefined
      }
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.75}
        style={[styles.faqRow, { backgroundColor: rowBg }]}
      >
        <Text style={[styles.faqQuestion, { color: textColor }]}>
          {item.q}
        </Text>
        <Animated.View style={rotateStyle}>
          <ChevronDown size={16} color={textSub} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={answerContainerStyle}>
        <View onLayout={handleLayout}>
          <Animated.Text
            style={[styles.faqAnswer, { color: textSub }, answerOpacityStyle]}
          >
            {item.a}
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon,
  title,
  children,
  labelColor,
  cardBg,
  cardBorder,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  labelColor: string;
  cardBg: string;
  cardBorder: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>{title}</Text>
      </View>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const insets = useSafeAreaInsets();

  const [selectedLang, setSelectedLang] = useState('ru');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const labelColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const rowHoverBg = 'transparent';

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
        <Text style={[styles.headerTitle, { color: tk.text }]}>Настройки</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Язык ── */}
        <SectionCard
          icon={<Globe size={16} color={labelColor} />}
          title="ЯЗЫК ПРИЛОЖЕНИЯ"
          labelColor={labelColor}
          cardBg={tk.cardBg}
          cardBorder={tk.cardBorder}
        >
          {LANGUAGES.map((lang, i) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSelectedLang(lang.code)}
              activeOpacity={0.75}
              style={[
                styles.langRow,
                i < LANGUAGES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: tk.divider,
                },
              ]}
            >
              <View style={styles.langLeft}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langLabel, { color: tk.text }]}>
                  {lang.label}
                </Text>
              </View>
              {selectedLang === lang.code && (
                <View
                  style={[
                    styles.checkCircle,
                    {
                      shadowColor: '#FFD700',
                      shadowOpacity: 0.5,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 0 },
                    },
                  ]}
                >
                  <Check size={12} color="#000" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </SectionCard>

        {/* ── FAQ ── */}
        <SectionCard
          icon={<HelpCircle size={16} color={labelColor} />}
          title="ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ"
          labelColor={labelColor}
          cardBg={tk.cardBg}
          cardBorder={tk.cardBorder}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              dividerColor={tk.divider}
              textColor={tk.text}
              textSub={tk.textSecondary}
              rowBg={rowHoverBg}
            />
          ))}
        </SectionCard>

        {/* ── Связаться ── */}
        <SectionCard
          icon={<Mail size={16} color={labelColor} />}
          title="СВЯЗАТЬСЯ С НАМИ"
          labelColor={labelColor}
          cardBg={tk.cardBg}
          cardBorder={tk.cardBorder}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: tk.text }]}>
              support@raytechvpn.com
            </Text>
            <Mail size={18} color={tk.textSecondary} />
          </View>
        </SectionCard>

        {/* ── О приложении ── */}
        <SectionCard
          icon={<Info size={16} color={labelColor} />}
          title="О ПРИЛОЖЕНИИ"
          labelColor={labelColor}
          cardBg={tk.cardBg}
          cardBorder={tk.cardBorder}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoText, { color: tk.text }]}>Версия</Text>
            <Text style={[styles.infoValue, { color: tk.textSecondary }]}>
              V1.0.0
            </Text>
          </View>
        </SectionCard>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  section: { gap: 6 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  // Language
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  langLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langFlag: { fontSize: 20 },
  langLabel: { fontSize: 16 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  // FAQ
  faqItemWrap: {
    borderBottomWidth: 1,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoText: { fontSize: 15 },
  infoValue: { fontSize: 15, fontWeight: '500' },
});
