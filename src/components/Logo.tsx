import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/theme/tokens';

interface LogoProps {
  small?: boolean;
}

export function Logo({ small = false }: LogoProps) {
  const theme = useAppStore((s) => s.theme);
  const tk = t(theme);

  const fontSize = small ? 22 : 42;
  const iconSize = small ? 18 : 34;
  const gap = small ? 3 : 6;

  return (
    <View style={[styles.row, { gap }]}>
      <Text
        style={[
          styles.text,
          { fontSize, color: tk.text },
        ]}
      >
        Ray
      </Text>
      <View
        style={[
          styles.iconWrap,
          {
            width: iconSize + 8,
            height: iconSize + 8,
            borderRadius: (iconSize + 8) / 2,
            shadowColor: tk.primary,
            shadowOpacity: 0.6,
            shadowRadius: small ? 8 : 14,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        <Zap
          size={iconSize}
          color={tk.primary}
          fill={tk.primary}
          strokeWidth={1.5}
        />
      </View>
      <Text
        style={[
          styles.text,
          { fontSize, color: tk.text },
        ]}
      >
        Tech
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
