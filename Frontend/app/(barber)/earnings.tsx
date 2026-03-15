import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const EARNINGS_DATA = {
  totalBalance: 45200, lastMonth: 124000, today: 8500, average: 5200,
  history: [
    { id: '1', date: 'Mar 12, 2024', amount: 8500, status: 'Paid' },
    { id: '2', date: 'Mar 05, 2024', amount: 12000, status: 'Paid' },
  ]
};

// Placeholder for WEEK_REVENUE, TODAY_SCHEDULE, and BARBERS as they were removed from MockData import
// and not fully replaced in the provided instruction.
// This will cause runtime errors if not properly addressed by the user.
const WEEK_REVENUE = [
  { day: 'Mon', amount: 3000 },
  { day: 'Tue', amount: 5000 },
  { day: 'Wed', amount: 4500 },
  { day: 'Thu', amount: 6000 },
  { day: 'Fri', amount: 7000 },
  { day: 'Sat', amount: 8000 },
  { day: 'Sun', amount: 2000 },
];

const TODAY_SCHEDULE = [
  { id: '1', customerName: 'John Doe', service: 'Haircut', amount: 1500, status: 'completed', time: '10:00 AM' },
  { id: '2', customerName: 'Jane Smith', service: 'Beard Trim', amount: 800, status: 'completed', time: '11:30 AM' },
  { id: '3', customerName: 'Peter Jones', service: 'Shave', amount: 700, status: 'pending', time: '01:00 PM' },
];

const BARBERS = [
  { id: '1', name: 'Barber 1', rating: 4.8 },
];

const barber = BARBERS[0];

export default function EarningsScreen() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const total = WEEK_REVENUE.reduce((s, d) => s + d.amount, 0);
  const maxVal = Math.max(...WEEK_REVENUE.map(d => d.amount));
  const todayEarned = TODAY_SCHEDULE.filter(s => s.status === 'completed').reduce((s, a) => s + a.amount, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
        <View style={styles.periodRow}>
          {(['week', 'month'] as const).map(p => (
            <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodBtnActive]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{period === 'week' ? 'Weekly' : 'Monthly'} Revenue</Text>
        <Text style={styles.totalAmount}>Rs. {(period === 'week' ? total : total * 4.3).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
        <View style={styles.totalStats}>
          <View style={styles.totalStat}>
            <Text style={styles.totalStatValue}>{period === 'week' ? TODAY_SCHEDULE.length : `${TODAY_SCHEDULE.length * 5}+`}</Text>
            <Text style={styles.totalStatLabel}>Appointments</Text>
          </View>
          <View style={styles.totalStatDivider} />
          <View style={styles.totalStat}>
            <Text style={styles.totalStatValue}>{barber.rating}</Text>
            <Text style={styles.totalStatLabel}>Avg Rating</Text>
          </View>
          <View style={styles.totalStatDivider} />
          <View style={styles.totalStat}>
            <Text style={styles.totalStatValue}>Rs. {todayEarned.toLocaleString()}</Text>
            <Text style={styles.totalStatLabel}>Today</Text>
          </View>
        </View>
      </View>

      {/* Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Daily Revenue</Text>
        <View style={styles.chart}>
          {WEEK_REVENUE.map(d => {
            const barH = (d.amount / maxVal) * 120;
            return (
              <View key={d.day} style={styles.barCol}>
                <Text style={styles.barAmount}>Rs.{Math.round(d.amount / 1000)}k</Text>
                <View style={styles.barWrap}>
                  <View style={[styles.bar, { height: barH }]} />
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Recent Payments */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
      </View>
      {TODAY_SCHEDULE.filter(s => s.status === 'completed').map(apt => (
        <View key={apt.id} style={styles.payRow}>
          <View style={styles.payLeft}>
            <Text style={styles.payCustomer}>{apt.customerName}</Text>
            <Text style={styles.payService}>{apt.service}</Text>
          </View>
          <View style={styles.payRight}>
            <Text style={styles.payAmount}>+ Rs. {apt.amount.toLocaleString()}</Text>
            <Text style={styles.payTime}>{apt.time}</Text>
          </View>
        </View>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800', marginBottom: Spacing.sm },
  periodRow: { flexDirection: 'row', gap: Spacing.sm },
  periodBtn: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  periodBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  periodText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  periodTextActive: { color: Colors.black },
  totalCard: { margin: Spacing.lg, backgroundColor: Colors.goldDark + '22', borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '55', alignItems: 'center' },
  totalLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: Spacing.sm },
  totalAmount: { color: Colors.gold, fontSize: 36, fontWeight: '900', letterSpacing: 0.5, marginBottom: Spacing.md },
  totalStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  totalStat: { alignItems: 'center', gap: 3 },
  totalStatValue: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  totalStatLabel: { color: Colors.textMuted, fontSize: 11 },
  totalStatDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  chartSection: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionHeader: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '800', marginBottom: Spacing.sm },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, height: 180, paddingBottom: 32 },
  barCol: { flex: 1, alignItems: 'center', position: 'relative' },
  barAmount: { color: Colors.textMuted, fontSize: 8, marginBottom: 2, position: 'absolute', top: 0 },
  barWrap: { width: 24, alignItems: 'center', justifyContent: 'flex-end', height: 130 },
  bar: { width: '100%', backgroundColor: Colors.gold, borderRadius: 4, minHeight: 8 },
  barDay: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', position: 'absolute', bottom: 0 },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  payLeft: {},
  payCustomer: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  payService: { color: Colors.textSecondary, fontSize: 12 },
  payRight: { alignItems: 'flex-end' },
  payAmount: { color: Colors.success, fontSize: 14, fontWeight: '700' },
  payTime: { color: Colors.textMuted, fontSize: 11 },
});
