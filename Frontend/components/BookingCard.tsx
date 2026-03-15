import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { BookingStatus } from '@/constants/types';

interface BookingCardProps {
  id: string;
  barberName: string;
  barberInitials: string;
  barberColor: string;
  serviceName: string;
  date: string;
  startTime: string;
  status: BookingStatus;
  amount: number;
  onPress?: () => void;
}

export default function BookingCard({ barberName, barberInitials, barberColor, serviceName, date, startTime, status, amount, onPress }: BookingCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.top}>
        <Avatar initials={barberInitials} color={barberColor} size={46} fontSize={16} />
        <View style={styles.info}>
          <Text style={styles.barberName}>{barberName}</Text>
          <Text style={styles.service}>{serviceName}</Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.amount}>Rs. {amount.toLocaleString()}</Text>
          <StatusBadge status={status} small />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.bottom}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>🕐</Text>
          <Text style={styles.metaText}>{startTime}</Text>
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
  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  info: { flex: 1 },
  barberName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  service: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  rightCol: { alignItems: 'flex-end', gap: 4 },
  amount: { color: Colors.gold, fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  bottom: { flexDirection: 'row', gap: Spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaIcon: { fontSize: 13 },
  metaText: { color: Colors.textSecondary, fontSize: 13 },
});
