import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import Avatar from './Avatar';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';
import { BarberStatus } from '@/constants/MockData';

interface BarberCardProps {
  name: string;
  initials: string;
  color: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  experience: number;
  status: BarberStatus;
  price: string;
  onPress?: () => void;
}

export default function BarberCard({ name, initials, color, specialization, rating, reviewCount, experience, status, price, onPress }: BarberCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Avatar initials={initials} color={color} size={56} fontSize={20} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.spec}>{specialization}</Text>
          <StarRating rating={rating} reviewCount={reviewCount} size={13} />
        </View>
        <StatusBadge status={status} small />
      </View>
      <View style={styles.footer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>⏱ {experience} yrs exp</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>💈 {price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  info: { flex: 1, gap: 3 },
  name: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  spec: { color: Colors.textSecondary, fontSize: 13 },
  footer: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  tag: { backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  tagText: { color: Colors.textSecondary, fontSize: 12 },
});
