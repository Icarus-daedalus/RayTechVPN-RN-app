import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Key, Eye, EyeOff } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

type SheetMode = 'login' | 'register' | null;

function AuthSheet({
  mode,
  onClose,
}: {
  mode: SheetMode;
  onClose: () => void;
}) {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localMode, setLocalMode] = useState(mode);

  const translateY = useSharedValue(600);
  const backdropAlpha = useSharedValue(0);

  useEffect(() => {
    if (mode) {
      setLocalMode(mode);
      translateY.value = withTiming(0, { duration: 300 });
      backdropAlpha.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(600, { duration: 280 });
      backdropAlpha.value = withTiming(0, { duration: 200 });
    }
  }, [mode]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropAlpha.value,
  }));

  const cardBg =
    theme === 'light'
      ? 'rgba(255,255,255,0.97)'
      : 'rgba(26,26,36,0.97)';

  return (
    <>
      {mode && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 40 },
            backdropStyle,
          ]}
        >
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.authSheet,
          {
            backgroundColor: cardBg,
            borderColor: tk.cardBorder,
            zIndex: 50,
          },
          sheetStyle,
        ]}
      >
        {/* Handle */}
        <View style={styles.authHandle}>
          <View style={[styles.handleBar, { backgroundColor: tk.dragHandle }]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.authContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.authTitle, { color: tk.text }]}>
            {localMode === 'register' ? 'Регистрация' : 'С возвращением'}
          </Text>

          {/* Email */}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: tk.inputBg,
                borderColor: tk.inputBorder,
              },
            ]}
          >
            <View style={styles.inputIconBox}>
              <Mail size={18} color="white" />
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Эл. почта"
              placeholderTextColor={tk.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.textInput, { color: tk.text }]}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: tk.inputBg,
                borderColor: tk.inputBorder,
              },
            ]}
          >
            <View style={styles.inputIconBox}>
              <Key size={18} color="white" />
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Пароль"
              placeholderTextColor={tk.textMuted}
              secureTextEntry={!showPass}
              style={[styles.textInput, { color: tk.text }]}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeBtn}
            >
              {showPass ? (
                <Eye size={20} color={tk.textMuted} />
              ) : (
                <EyeOff size={20} color={tk.textMuted} />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm password (register only) */}
          {localMode === 'register' && (
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: tk.inputBg,
                  borderColor: tk.inputBorder,
                },
              ]}
            >
              <View style={styles.inputIconBox}>
                <Key size={18} color="white" />
              </View>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Подтвердите пароль"
                placeholderTextColor={tk.textMuted}
                secureTextEntry={!showConfirm}
                style={[styles.textInput, { color: tk.text }]}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeBtn}
              >
                {showConfirm ? (
                  <Eye size={20} color={tk.textMuted} />
                ) : (
                  <EyeOff size={20} color={tk.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          )}

          {localMode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: tk.textSecondary }]}>
                Забыли пароль?
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.88}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>
              {localMode === 'register' ? 'Зарегистрироваться' : 'Вход'}
            </Text>
          </TouchableOpacity>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: tk.textSecondary }]}>
              {localMode === 'register' ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setLocalMode(localMode === 'register' ? 'login' : 'register')
              }
            >
              <Text style={styles.toggleLink}>
                {localMode === 'register' ? 'Войти' : 'Регистрация'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

export default function ProfileScreen() {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);
  const insets = useSafeAreaInsets();
  const [sheetMode, setSheetMode] = useState<SheetMode>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={[styles.backBtn, { backgroundColor: tk.btnIconBg }]}
          >
            <ChevronLeft size={22} color={tk.text} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tk.text }]}>Профиль</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Avatar */}
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor:
                  theme === 'light' ? 'rgba(203,213,225,1)' : 'rgba(30,41,59,1)',
                borderColor: 'rgba(255,255,255,0.25)',
              },
            ]}
          >
            <User size={52} color={theme === 'light' ? '#94a3b8' : '#64748b'} />
          </View>

          <Text style={[styles.guestName, { color: tk.text }]}>Гость</Text>
          <Text style={[styles.guestDesc, { color: tk.textSecondary }]}>
            Войдите в свой аккаунт, чтобы получить доступ к премиум-серверам и
            синхронизировать подписку.
          </Text>

          <View style={styles.btnGroup}>
            <TouchableOpacity
              onPress={() => setSheetMode('login')}
              activeOpacity={0.88}
              style={[styles.primaryBtn, { shadowColor: '#FFD700' }]}
            >
              <Text style={styles.primaryBtnText}>Войти</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSheetMode('register')}
              activeOpacity={0.88}
              style={styles.outlineBtn}
            >
              <Text style={styles.outlineBtnText}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Auth bottom sheet */}
        <AuthSheet mode={sheetMode} onClose={() => setSheetMode(null)} />
      </View>
    </KeyboardAvoidingView>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  guestName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  guestDesc: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  btnGroup: { width: '100%', gap: 14 },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '600', color: '#000' },
  outlineBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: { fontSize: 17, fontWeight: '600', color: '#FFD700' },
  // ─── Auth Sheet ───
  authSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
  authHandle: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handleBar: { width: 48, height: 5, borderRadius: 3 },
  authContent: { paddingHorizontal: 24, paddingBottom: 48, gap: 14 },
  authTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 8,
    gap: 8,
  },
  inputIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textInput: { flex: 1, fontSize: 16 },
  eyeBtn: { padding: 8 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 14 },
  submitBtn: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  submitBtnText: { fontSize: 17, fontWeight: '600', color: '#000' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  toggleLabel: { fontSize: 14 },
  toggleLink: { fontSize: 14, fontWeight: '600', color: '#4A72FF' },
});
