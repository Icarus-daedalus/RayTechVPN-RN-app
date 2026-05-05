import { DeviceEventEmitter, Platform } from 'react-native';
import WireGuardVpnModule, { type WireGuardConfig, type WireGuardStatus } from 'react-native-wireguard-vpn';
import { ensureVpnPermission } from '@/vpn/ensureVpnPermission';

let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = WireGuardVpnModule.initialize();
  }
  return initPromise;
}

/**
 * WireGuard native code emits `vpnStateChanged` via RCTDeviceEventEmitter, not via
 * NativeModule event subscription — using NativeEventEmitter(WireGuardVpnModule) triggers
 * RN warnings (missing addListener/removeListeners on the module).
 */
export function subscribeVpnState(
  listener: (status: WireGuardStatus) => void
): { remove(): void } {
  const sub = DeviceEventEmitter.addListener('vpnStateChanged', (payload: WireGuardStatus) => {
    listener(payload);
  });
  return {
    remove() {
      sub.remove();
    },
  };
}

export async function refreshVpnStatus(): Promise<WireGuardStatus> {
  return WireGuardVpnModule.getStatus();
}

export async function connectVpn(config: WireGuardConfig): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('WireGuard VPN is not supported on web');
  }

  const supported = await WireGuardVpnModule.isSupported();
  if (!supported) {
    throw new Error('WireGuard VPN is not supported on this device');
  }

  await ensureInitialized();

  if (Platform.OS === 'android') {
    await ensureVpnPermission();
  }

  await WireGuardVpnModule.connect(config);
}

export async function disconnectVpn(): Promise<void> {
  await ensureInitialized();
  await WireGuardVpnModule.disconnect();
}
