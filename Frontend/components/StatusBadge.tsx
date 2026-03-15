import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BarberStatus, BookingStatus } from '@/constants/types';

interface StatusBadgeProps {
  status: BookingStatus | string;
  small?: boolean;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: Colors.warning, bg: Colors.warning + '22', label: 'Pending' },
  confirmed:   { color: Colors.info,    bg: Colors.info + '22',    label: 'Confirmed' },
  completed:   { color: Colors.success, bg: Colors.success + '22', label: 'Completed' },
  cancelled:   { color: Colors.error,   bg: Colors.error + '22',   label: 'Cancelled' },
  rejected:    { color: Colors.error,   bg: Colors.error + '22',   label: 'Rejected' },
  rescheduled: { color: Colors.gold,    bg: Colors.gold + '22',    label: 'Rescheduled' },
  no_show:     { color: Colors.textMuted, bg: Colors.textMuted + '22', label: 'No Show' },
  available:   { color: Colors.success, bg: Colors.success + '22', label: 'Available' },
  busy:        { color: Colors.warning, bg: Colors.warning + '22', label: 'Busy' },
  off_duty:    { color: Colors.textMuted, bg: Colors.textMuted + '22', label: 'Off Duty' },
  paid:        { color: Colors.success, bg: Colors.success + '22', label: 'Paid' },
  refunded:    { color: Colors.info,    bg: Colors.info + '22',    label: 'Refunded' },
};

export default function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || { color: Colors.textSecondary, bg: Colors.card, label: status };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, small && styles.small]}>
      <Text style={[styles.text, { color: cfg.color }, small && styles.smallText]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  small: { paddingHorizontal: 7, paddingVertical: 2 },
  smallText: { fontSize: 10 },
});
