export type Theme = 'light' | 'dark';

export const tokens = {
  light: {
    // Backgrounds
    bg: '#8BCCD8',
    bgGradient: null as null | string[],
    // Surfaces
    surface: 'rgba(255,255,255,0.3)',
    surfaceBorder: 'rgba(255,255,255,0.5)',
    surfaceSecondary: 'rgba(255,255,255,0.2)',
    // Sidebar
    sidebarBg: 'rgba(255,255,255,0.92)',
    // Bottom sheet
    sheetBg: '#F2F2F7',
    sheetBorder: 'rgba(255,255,255,1)',
    // Server items
    serverItemBg: '#FFFFFF',
    serverItemSelectedBg: '#FFFDE7',
    serverItemSelectedBorder: '#FFD700',
    // Search
    searchBg: '#FFFFFF',
    searchPlaceholder: '#9CA3AF',
    // Tabs
    tabContainerBg: 'rgba(0,0,0,0.05)',
    tabActiveBg: '#FFFFFF',
    tabActiveText: '#000000',
    tabInactiveText: '#6A7282',
    // Text
    text: '#0F172B',
    textSecondary: '#45556C',
    textTertiary: '#6A7282',
    textMuted: '#99A1AF',
    // Accent
    primary: '#FFD700',
    primaryShadow: 'rgba(255,215,0,0.4)',
    // Header
    headerBg: 'rgba(255,255,255,0.3)',
    headerBorder: 'rgba(255,255,255,0.3)',
    // Divider
    divider: 'rgba(226,232,240,0.7)',
    // Card
    cardBg: 'rgba(255,255,255,0.4)',
    cardBorder: 'rgba(255,255,255,0.5)',
    // Input
    inputBg: '#FFFFFF',
    inputBorder: 'rgba(241,245,249,1)',
    // Premium
    premium: '#B8860B',
    // Drag handle
    dragHandle: '#D1D5DC',
    // Button styles
    btnIconBg: 'rgba(255,255,255,0.20)',
    // Overlay
    overlayBg: 'rgba(0,0,0,0.4)',
  },
  dark: {
    // Backgrounds
    bg: null as null | string,
    bgGradient: ['#0F2027', '#203A43', '#2C5364'] as string[],
    // Surfaces
    surface: 'rgba(0,0,0,0.3)',
    surfaceBorder: 'rgba(255,255,255,0.1)',
    surfaceSecondary: 'rgba(0,0,0,0.2)',
    // Sidebar
    sidebarBg: 'rgba(18,18,18,0.95)',
    // Bottom sheet
    sheetBg: '#1C1C1E',
    sheetBorder: 'rgba(255,255,255,0.1)',
    // Server items
    serverItemBg: '#2C2C2E',
    serverItemSelectedBg: '#3E3A1A',
    serverItemSelectedBorder: '#FFD700',
    // Search
    searchBg: '#2C2C2E',
    searchPlaceholder: '#6A7282',
    // Tabs
    tabContainerBg: 'rgba(255,255,255,0.05)',
    tabActiveBg: '#3A3A3C',
    tabActiveText: '#FFFFFF',
    tabInactiveText: '#6A7282',
    // Text
    text: '#F1F5F9',
    textSecondary: '#90A1B9',
    textTertiary: '#6A7282',
    textMuted: '#6A7282',
    // Accent
    primary: '#FFD700',
    primaryShadow: 'rgba(255,215,0,0.4)',
    // Header
    headerBg: 'rgba(0,0,0,0.2)',
    headerBorder: 'rgba(255,255,255,0.08)',
    // Divider
    divider: 'rgba(255,255,255,0.08)',
    // Card
    cardBg: 'rgba(0,0,0,0.25)',
    cardBorder: 'rgba(255,255,255,0.1)',
    // Input
    inputBg: '#2A2A35',
    inputBorder: 'rgba(255,255,255,0.05)',
    // Premium
    premium: '#B8860B',
    // Drag handle
    dragHandle: '#4B5563',
    // Button styles
    btnIconBg: 'rgba(0,0,0,0.20)',
    // Overlay
    overlayBg: 'rgba(0,0,0,0.5)',
  },
} as const;

export function t(theme: Theme) {
  return tokens[theme];
}
