import type { WireGuardConfig } from 'react-native-wireguard-vpn';

/**
 * Test profile mapped from a WireGuard client `.conf` (see plan):
 * - [Interface] PrivateKey → privateKey
 * - Address → address (tunnel IP, not 0.0.0.0/0)
 * - DNS → dns
 * - [Peer] PublicKey → publicKey
 * - PresharedKey → presharedKey
 * - AllowedIPs → allowedIPs
 * - Endpoint host:port → serverAddress / serverPort
 *
 * Replace `privateKey`, `publicKey`, and `presharedKey` with values from your real INI
 * if these placeholders do not match your server.
 *
 * Tunnel IP: use /32 (not /24) unless your provider explicitly documents otherwise — wrong
 * prefix can break routing. If handshake works but return traffic dies behind NAT, the
 * official client uses PersistentKeepalive; this npm package does not expose it (fork/patch
 * native `Peer.Builder` if you need it).
 */
export const TEST_WIREGUARD_CONFIG: WireGuardConfig = {
  privateKey: '8MipwIxT5CCK7tIVqRxuhZSRaz5+UwZO8Xo5kP2C7HI=',
  publicKey: 'EL/Rb1ig42JHRsvPX8N7PCz2LnbSgUuJQR1/SIZ5JBM=',
  presharedKey: 'htEugKH9/kJuvRJIYLwHo0d5i/M7u1NrWMNxXTRUqhw=',
  serverAddress: '147.45.217.206',
  serverPort: 51820,
  address: '10.8.0.2/24',
  allowedIPs: ['0.0.0.0/0', '::/0'],
  dns: ['1.1.1.1'],
};
