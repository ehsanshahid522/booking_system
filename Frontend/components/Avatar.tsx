import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '@/constants/Colors';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
  fontSize?: number;
}

export default function Avatar({ initials, color = Colors.gold, size = 48, fontSize = 18 }: AvatarProps) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '33' }]}>
      <Text style={[styles.initials, { fontSize, color }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
