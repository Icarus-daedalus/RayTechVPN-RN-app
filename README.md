# RayTechVPN (Expo)

## VPN / WireGuard (dev build only)

`react-native-wireguard-vpn` does **not** run in **Expo Go**. Use a **development build** after native generation:

```bash
npx expo prebuild
npx expo run:android
# iOS (device + Xcode tunnel extension setup per library README):
npx expo prebuild -p ios --clean
npx expo run:ios --device
```

After changing `app.json` plugins or native modules, re-run `prebuild` (add `--clean` if autolinking or Gradle gets out of sync) and rebuild the app.

WireGuard is configured in `src/constants/testWireGuardConfig.ts`. On Android, the app requests the system VPN consent dialog (`VpnService`) before connecting.
