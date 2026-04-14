import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Signal, ChevronUp, Search } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';
import { SERVERS } from '@/constants/servers';
import type { ServerItem } from '@/store/useAppStore';

const { height: H } = Dimensions.get('window');
const COLLAPSED_H = H * 0.25;
const EXPANDED_H = H * 0.82;
// Sheet is exactly EXPANDED_H tall; translateY shifts it down to show only COLLAPSED_H
const COLLAPSED_TRANSLATE = EXPANDED_H - COLLAPSED_H;
const SNAP_MID = COLLAPSED_TRANSLATE / 2;

function speedColor(speed: ServerItem['speed']) {
  return speed === 'Good' ? '#22c55e' : speed === 'Average' ? '#eab308' : '#ef4444';
}

const TIMING = { duration: 280 };

export function ServerSheet() {
  const theme = useAppStore((s) => s.theme);
  const selectedServer = useAppStore((s) => s.selectedServer);
  const setSelectedServer = useAppStore((s) => s.setSelectedServer);
  const tk = t(theme);

  const [activeTab, setActiveTab] = useState<'vpn' | 'proxy'>('vpn');
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const translateY = useSharedValue(COLLAPSED_TRANSLATE);
  const startY = useSharedValue(0);

  // These run on JS thread — only for React state
  function jsExpand() { setIsExpanded(true); }
  function jsCollapse() { setIsExpanded(false); }

  function snapExpand() {
    translateY.value = withTiming(0, TIMING);
    runOnJS(jsExpand)();
  }

  function snapCollapse() {
    translateY.value = withTiming(COLLAPSED_TRANSLATE, TIMING);
    runOnJS(jsCollapse)();
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      const next = startY.value + e.translationY;
      translateY.value = Math.max(0, Math.min(COLLAPSED_TRANSLATE, next));
    })
    .onEnd((e) => {
      'worklet';
      const shouldExpand =
        e.translationY < -60 ||
        e.velocityY < -500 ||
        (e.translationY >= -60 && e.translationY <= 60 && translateY.value < SNAP_MID);

      if (shouldExpand) {
        translateY.value = withTiming(0, TIMING);
        runOnJS(jsExpand)();
      } else {
        translateY.value = withTiming(COLLAPSED_TRANSLATE, TIMING);
        runOnJS(jsCollapse)();
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredServers = SERVERS.filter((s) =>
    s.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          backgroundColor: tk.sheetBg,
          borderColor: tk.sheetBorder,
        },
        sheetStyle,
      ]}
    >
      {/* Drag handle */}
      <GestureDetector gesture={pan}>
        <TouchableOpacity
          onPress={() => (isExpanded ? snapCollapse() : snapExpand())}
          activeOpacity={1}
          style={styles.handleArea}
        >
          <View style={[styles.handle, { backgroundColor: tk.dragHandle }]} />
        </TouchableOpacity>
      </GestureDetector>

      <View style={styles.content}>
        {!isExpanded ? (
          // ─── Collapsed ───
          <View style={styles.collapsedContent}>
            <Text style={[styles.currentServerLabel, { color: tk.text }]}>
              Текущий сервер
            </Text>

            <TouchableOpacity
              onPress={snapExpand}
              activeOpacity={0.85}
              style={[
                styles.serverRow,
                { backgroundColor: tk.serverItemBg, borderColor: tk.divider },
              ]}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.flag}>{selectedServer.flag}</Text>
                <Text style={[styles.serverName, { color: tk.text }]}>
                  {selectedServer.country}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Signal size={14} color={speedColor(selectedServer.speed)} />
                <Text style={[styles.ping, { color: tk.textTertiary }]}>
                  {selectedServer.ping} ms
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.pullHint}>
              <ChevronUp size={14} color={tk.textMuted} />
              <Text style={[styles.pullHintText, { color: tk.textMuted }]}>
                Потяните вверх для настройки
              </Text>
            </View>
          </View>
        ) : (
          // ─── Expanded ───
          <View style={styles.expandedContent}>
            {/* Tabs */}
            <View
              style={[
                styles.tabContainer,
                { backgroundColor: tk.tabContainerBg },
              ]}
            >
              {(['vpn', 'proxy'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                  style={[
                    styles.tab,
                    activeTab === tab && {
                      backgroundColor: tk.tabActiveBg,
                      shadowColor: '#000',
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color:
                          activeTab === tab
                            ? tk.tabActiveText
                            : tk.tabInactiveText,
                        fontWeight: activeTab === tab ? '600' : '400',
                      },
                    ]}
                  >
                    {tab === 'vpn' ? 'VPN Серверы' : 'Premium servers'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search */}
            <View
              style={[
                styles.searchContainer,
                { backgroundColor: tk.searchBg },
              ]}
            >
              <Search size={18} color={tk.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Поиск..."
                placeholderTextColor={tk.searchPlaceholder}
                style={[styles.searchInput, { color: tk.text }]}
              />
            </View>

            {/* Server list */}
            <FlatList
              data={filteredServers}
              keyExtractor={(item) => item.country}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = item.country === selectedServer.country;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedServer(item);
                      snapCollapse();
                    }}
                    activeOpacity={0.85}
                    style={[
                      styles.serverItem,
                      {
                        backgroundColor: isSelected
                          ? tk.serverItemSelectedBg
                          : tk.serverItemBg,
                        borderColor: isSelected
                          ? tk.serverItemSelectedBorder
                          : 'transparent',
                      },
                    ]}
                  >
                    <View style={styles.rowLeft}>
                      <Text style={styles.serverItemFlag}>{item.flag}</Text>
                      <Text
                        style={[styles.serverItemName, { color: tk.text }]}
                      >
                        {item.country}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text
                        style={[
                          styles.serverItemPing,
                          { color: tk.textTertiary },
                        ]}
                      >
                        {item.ping} ms
                      </Text>
                      <Signal size={16} color={speedColor(item.speed)} />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: EXPANDED_H,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -6 },
    zIndex: 20,
  },
  handleArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // --- Collapsed ---
  collapsedContent: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
  },
  currentServerLabel: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  serverRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: { fontSize: 22 },
  serverName: { fontSize: 16, fontWeight: '500' },
  ping: { fontSize: 13 },
  pullHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pullHintText: { fontSize: 12 },
  // --- Expanded ---
  expandedContent: { flex: 1 },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabText: { fontSize: 14 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 48,
  },
  listContent: { gap: 8, paddingBottom: 32 },
  serverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  serverItemFlag: { fontSize: 24 },
  serverItemName: { fontSize: 17, fontWeight: '500' },
  serverItemPing: { fontSize: 13 },
});
