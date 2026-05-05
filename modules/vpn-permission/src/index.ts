import { requireNativeModule } from 'expo-modules-core';

type VpnPermissionNativeModule = {
  ensureVpnPermission(): Promise<void>;
};

const VpnPermission = requireNativeModule<VpnPermissionNativeModule>('VpnPermission');

export function ensureVpnPermission(): Promise<void> {
  return VpnPermission.ensureVpnPermission();
}
