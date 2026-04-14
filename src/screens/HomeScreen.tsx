import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun, Menu } from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { ConnectToggle } from '@/components/ConnectToggle';
import { AdCarousel } from '@/components/AdCarousel';
import { ServerSheet } from '@/components/ServerSheet';
import { Sidebar } from '@/components/Sidebar';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

export default function HomeScreen() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const tk = t(theme);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const btnBg =
    theme === 'light' ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)';
  const btnColor = theme === 'light' ? '#1e293b' : '#e2e8f0';

  return (
    <View style={styles.root}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12 },
        ]}
      >
        <TouchableOpacity
          onPress={() => setSidebarOpen(true)}
          activeOpacity={0.8}
          style={[styles.iconBtn, { backgroundColor: btnBg }]}
        >
          <Menu size={24} color={btnColor} strokeWidth={2.5} />
        </TouchableOpacity>

        <Logo small />

        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.8}
          style={[styles.iconBtn, { backgroundColor: btnBg }]}
        >
          {theme === 'light' ? (
            <Moon size={22} color={btnColor} strokeWidth={2.5} />
          ) : (
            <Sun size={22} color={btnColor} strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </View>

      {/* Main content — toggle + carousel centered as a group */}
      <View style={styles.main}>
        <ConnectToggle />
        <AdCarousel />
      </View>

      {/* Bottom sheet — absolutely positioned */}
      <ServerSheet />

      {/* Sidebar — absolutely positioned */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '52%',
    zIndex: 1,
  },
});
