import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { PAYMENTS, ADMIN_STATS } from '@/constants/MockData';
import StatusBadge from '@/components/StatusBadge';

export default function PaymentsScreen() {
  const paid = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Total Revenue', value: `Rs. ${ADMIN_STATS.totalRevenue.toLocaleString()}`, color: Colors.gold },
          { label: 'This Month', value: `Rs. ${ADMIN_STATS.monthRevenue.toLocaleString()}`, color: Colors.success },
          { label: 'Today', value: `Rs. ${paid.toLocaleString()}`, color: Colors.info },
        ].map(s => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Method Breakdown */}
      <View style={styles.methodSection}>
        <Text style={styles.sectionTitle}>By Payment Method</Text>
        <View style={styles.methodRow}>
          {[
            { method: '💳 Online', pct: 65, color: Colors.gold },
            { method: '💵 Cash', pct: 25, color: Colors.success },
            { method: '🏧 Card', pct: 10, color: Colors.info },
          ].map(m => (
            <View key={m.method} style={styles.methodItem}>
              <View style={[styles.methodBar, { height: m.pct, backgroundColor: m.color }]} />
              <Text style={styles.methodPct}>{m.pct}%</Text>
              <Text style={styles.methodLabel}>{m.method}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle2}>Recent Transactions</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {PAYMENTS.map(p => (
          <View key={p.id} style={styles.payRow}>
            <View style={styles.payLeft}>
              <Text style={styles.payService}>{p.service}</Text>
              <Text style={styles.payBarber}>with {p.barber}</Text>
              <Text style={styles.payDate}>{p.date} · {p.method}</Text>
            </View>
            <View style={styles.payRight}>
              <Text style={[styles.payAmount, p.status === 'refunded' && styles.refundedAmount]}>
                {p.status === 'refunded' ? '-' : '+'}Rs. {p.amount.toLocaleString()}
              </Text>
              <StatusBadge status={p.status} small />
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.lg },
  summaryCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: Colors.border },
  summaryValue: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  summaryLabel: { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  methodSection: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { color: Colors.text, fontSize: 15, fontWeight: '800', marginBottom: Spacing.sm },
  methodRow: { flexDirection: 'row', gap: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'flex-end', height: 140 },
  methodItem: { alignItems: 'center', gap: 4, width: 60 },
  methodBar: { width: 32, borderRadius: 4, minHeight: 8 },
  methodPct: { color: Colors.text, fontWeight: '700', fontSize: 12 },
  methodLabel: { color: Colors.textMuted, fontSize: 10, textAlign: 'center' },
  sectionTitle2: { color: Colors.text, fontSize: 15, fontWeight: '800', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  payRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  payLeft: {},
  payService: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  payBarber: { color: Colors.textSecondary, fontSize: 12 },
  payDate: { color: Colors.textMuted, fontSize: 11 },
  payRight: { alignItems: 'flex-end', gap: 4 },
  payAmount: { color: Colors.success, fontSize: 15, fontWeight: '700' },
  refundedAmount: { color: Colors.error },
});
