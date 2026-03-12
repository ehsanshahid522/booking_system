import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { TODAY_SCHEDULE } from '@/constants/MockData';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState(TODAY_SCHEDULE);

  const markComplete = (id: string) => {
    Alert.alert('Mark Complete', 'Mark this appointment as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => setSchedule(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' as any } : a)) },
    ]);
  };

  const total = schedule.reduce((s, a) => s + a.amount, 0);
  const done = schedule.filter(a => a.status === 'completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Schedule</Text>
        <Text style={styles.date}>📅 {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Total', value: schedule.length.toString(), color: Colors.text },
          { label: 'Done', value: done.toString(), color: Colors.success },
          { label: 'Left', value: (schedule.length - done).toString(), color: Colors.warning },
          { label: 'Earnings', value: `Rs. ${total.toLocaleString()}`, color: Colors.gold },
        ].map(s => (
          <View key={s.label} style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {schedule.map(apt => (
          <View key={apt.id} style={[styles.aptRow, apt.status === 'completed' && styles.aptDone]}>
            {/* Time */}
            <View style={styles.timeCol}>
              <Text style={styles.startTime}>{apt.time}</Text>
              <View style={styles.dot} />
              <Text style={styles.endTime}>{apt.endTime}</Text>
            </View>

            {/* Card */}
            <View style={styles.aptCard}>
              <View style={styles.aptTop}>
                <Avatar initials={apt.customerInitials} color={apt.customerColor} size={40} fontSize={14} />
                <View style={styles.aptInfo}>
                  <Text style={styles.aptName}>{apt.customerName}</Text>
                  <Text style={styles.aptService}>{apt.service}</Text>
                </View>
                <View style={styles.aptRight}>
                  <Text style={styles.aptAmount}>Rs. {apt.amount.toLocaleString()}</Text>
                  <StatusBadge status={apt.status} small />
                </View>
              </View>
              {apt.status === 'confirmed' && (
                <TouchableOpacity style={styles.completeBtn} onPress={() => markComplete(apt.id)}>
                  <Text style={styles.completeBtnText}>Mark Complete ✓</Text>
                </TouchableOpacity>
              )}
              {apt.status === 'pending' && (
                <View style={styles.pendingRow}>
                  <TouchableOpacity style={styles.acceptBtn}><Text style={styles.acceptText}>Accept ✓</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn}><Text style={styles.rejectText}>Reject ✕</Text></TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  date: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  summaryRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginVertical: Spacing.md, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  summaryItem: { flex: 1, alignItems: 'center', gap: 3 },
  summaryValue: { fontSize: 16, fontWeight: '800' },
  summaryLabel: { color: Colors.textMuted, fontSize: 11 },
  aptRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  aptDone: { opacity: 0.6 },
  timeCol: { width: 54, alignItems: 'center', gap: 3, paddingTop: Spacing.sm },
  startTime: { color: Colors.gold, fontSize: 11, fontWeight: '700' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold + '66' },
  endTime: { color: Colors.textMuted, fontSize: 10 },
  aptCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  aptTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  aptInfo: { flex: 1 },
  aptName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  aptService: { color: Colors.textSecondary, fontSize: 12 },
  aptRight: { alignItems: 'flex-end', gap: 3 },
  aptAmount: { color: Colors.gold, fontWeight: '700', fontSize: 12 },
  completeBtn: { backgroundColor: Colors.success + '22', borderRadius: Radius.sm, paddingVertical: 6, alignItems: 'center', marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.success + '88' },
  completeBtnText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  pendingRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  acceptBtn: { flex: 1, backgroundColor: Colors.success + '22', borderRadius: Radius.sm, paddingVertical: 6, alignItems: 'center', borderWidth: 1, borderColor: Colors.success },
  acceptText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  rejectBtn: { flex: 1, backgroundColor: Colors.error + '22', borderRadius: Radius.sm, paddingVertical: 6, alignItems: 'center', borderWidth: 1, borderColor: Colors.error },
  rejectText: { color: Colors.error, fontSize: 12, fontWeight: '700' },
});
