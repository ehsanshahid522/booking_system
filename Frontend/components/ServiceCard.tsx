import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

interface ServiceCardProps {
  name: string;
  price: number;
  duration: number;
  icon: string;
  category: string;
  onPress?: () => void;
  selected?: boolean;
}

export default function ServiceCard({ name, price, duration, icon, category, onPress, selected = false }: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, selected && styles.selectedIcon]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.name, selected && styles.selectedText]}>{name}</Text>
      <Text style={styles.category}>{category}</Text>
      <View style={styles.row}>
        <Text style={[styles.price, selected && { color: Colors.goldLight }]}>Rs. {price.toLocaleString()}</Text>
        <Text style={styles.duration}>⏱ {duration}m</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 150,
  },
  selectedCard: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '18',
  },
  iconBox: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedIcon: { backgroundColor: Colors.gold + '22', borderColor: Colors.gold },
  icon: { fontSize: 24 },
  name: { color: Colors.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  selectedText: { color: Colors.gold },
  category: { color: Colors.textSecondary, fontSize: 11, marginTop: 2, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  price: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  duration: { color: Colors.textMuted, fontSize: 12 },
});
