import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Theme } from '@/theme/tokens';

export interface ServerItem {
  country: string;
  flag: string;
  ping: number;
  speed: 'Good' | 'Average' | 'Poor';
}

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  // VPN (native WireGuard in dev build; see README)
  vpnConnected: boolean;
  vpnBusy: boolean;
  vpnError: string | null;
  setVpnConnected: (value: boolean) => void;
  setVpnBusy: (value: boolean) => void;
  setVpnError: (value: string | null) => void;
  // Selected server
  selectedServer: ServerItem;
  setSelectedServer: (server: ServerItem) => void;
  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const DEFAULT_SERVER: ServerItem = {
  country: 'Нидерланды',
  flag: '🇳🇱',
  ping: 12,
  speed: 'Good',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      vpnConnected: false,
      vpnBusy: false,
      vpnError: null,
      setVpnConnected: (value) => set({ vpnConnected: value }),
      setVpnBusy: (value) => set({ vpnBusy: value }),
      setVpnError: (value) => set({ vpnError: value }),

      selectedServer: DEFAULT_SERVER,
      setSelectedServer: (server) => set({ selectedServer: server }),

      isSidebarOpen: false,
      setSidebarOpen: (value) => set({ isSidebarOpen: value }),
    }),
    {
      name: 'raytechvpn-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
