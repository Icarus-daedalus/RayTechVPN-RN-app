import { useCallback, useEffect } from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import { TEST_WIREGUARD_CONFIG } from '@/constants/testWireGuardConfig';
import { useAppStore } from '@/store/useAppStore';
import {
  connectVpn,
  disconnectVpn,
  refreshVpnStatus,
  subscribeVpnState,
} from '@/vpn/wireguardService';

function mapNativeToConnected(status: { status: string; isConnected?: boolean }): boolean {
  return status.status === 'CONNECTED' || Boolean(status.isConnected);
}

export function useVpnController() {
  const vpnConnected = useAppStore((s) => s.vpnConnected);
  const vpnBusy = useAppStore((s) => s.vpnBusy);
  const vpnError = useAppStore((s) => s.vpnError);
  const setVpnConnected = useAppStore((s) => s.setVpnConnected);
  const setVpnBusy = useAppStore((s) => s.setVpnBusy);
  const setVpnError = useAppStore((s) => s.setVpnError);

  useEffect(() => {
    const apply = (payload: Parameters<typeof mapNativeToConnected>[0]) => {
      setVpnConnected(mapNativeToConnected(payload));
    };

    let sub = subscribeVpnState((status) => {
      apply(status);
      if (status.status === 'ERROR' && status.error) {
        setVpnError(status.error);
      }
    });

    const pull = () => {
      refreshVpnStatus()
        .then(apply)
        .catch(() => {});
    };

    pull();

    const onAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        pull();
      }
    };
    const appSub = AppState.addEventListener('change', onAppState);

    return () => {
      sub.remove();
      appSub.remove();
    };
  }, [setVpnConnected, setVpnError]);

  const requestConnect = useCallback(async () => {
    setVpnBusy(true);
    setVpnError(null);
    try {
      await connectVpn(TEST_WIREGUARD_CONFIG);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setVpnError(message);
      Alert.alert('VPN', message);
    } finally {
      setVpnBusy(false);
    }
  }, [setVpnBusy, setVpnError]);

  const requestDisconnect = useCallback(async () => {
    setVpnBusy(true);
    setVpnError(null);
    try {
      await disconnectVpn();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setVpnError(message);
      Alert.alert('VPN', message);
    } finally {
      setVpnBusy(false);
    }
  }, [setVpnBusy, setVpnError]);

  return {
    vpnConnected,
    vpnBusy,
    vpnError,
    requestConnect,
    requestDisconnect,
  };
}
