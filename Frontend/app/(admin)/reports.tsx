import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { ADMIN_STATS, BARBERS, SERVICES, WEEK_REVENUE } from '@/constants/MockData';

const maxV = Math.max(...WEEK_REVENUE.map(d => d.amount));

export default function ReportsScreen() {
  const topService = SERVICES[0];
  const topBarber = BARBERS[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Analytics & Insights</Text>
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewGrid}>
        {[
          { label: 'Total Bookings', value: ADMIN_STATS.totalBookings, icon: '📅', color: Colors.info },
          { label: 'Total Customers', value: ADMIN_STATS.totalCustomers, icon: '👥', color: Colors.success },
          { label: 'Cancel Rate', value: ADMIN_STATS.cancelRate, icon: '❌', color: Colors.error, isString: true },
          { label: 'Avg Rating', value: ADMIN_STATS.avgRating, icon: '⭐', color: Colors.gold, isString: true },
        ].map(s => (
          <View key={s.label} style={styles.overviewCard}>
            <Text style={styles.overviewIcon}>{s.icon}</Text>
            <Text style={[styles.overviewValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.overviewLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Revenue Trend</Text>
        <View style={styles.chart}>
          {WEEK_REVENUE.map(d => {
            const h = (d.amount / maxV) * 120;
            return (
              <View key={d.day} style={styles.barCol}>
                <Text style={styles.barLabel}>Rs.{Math.round(d.amount / 1000)}k</Text>
                <View style={styles.barWrap}>
                  <View style={[styles.bar, { height: h }]} />
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightIcon}>🏆</Text>
          <View style={styles.highlightInfo}>
            <Text style={styles.highlightTitle}>Top Barber</Text>
            <Text style={styles.highlightValue}>{topBarber.name}</Text>
            <Text style={styles.highlightSub}>{topBarber.reviewCount} reviews · ⭐ {topBarber.rating}</Text>
          </View>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightIcon}>💈</Text>
          <View style={styles.highlightInfo}>
            <Text style={styles.highlightTitle}>Most Booked Service</Text>
            <Text style={styles.highlightValue}>{topService.name}</Text>
            <Text style={styles.highlightSub}>Rs. {topService.price.toLocaleString()} · {topService.duration} min</Text>
          </View>
        </View>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightIcon}>⏰</Text>
          <View style={styles.highlightInfo}>
            <Text style={styles.highlightTitle}>Peak Hours</Text>
            <Text style={styles.highlightValue}>10:00 AM – 12:00 PM</Text>
            <Text style={styles.highlightSub}>Saturday & Friday are busiest days</Text>
          </View>
        </View>
      </View>

      {/* Top Services by Revenue */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Services by Revenue</Text>
        {SERVICES.slice(0, 5).map((svc, i) => (
          <View key={svc.id} style={styles.rankRow}>
            <Text style={styles.rankNum}>#{i + 1}</Text>
            <Text style={styles.rankIcon}>{svc.icon}</Text>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{svc.name}</Text>
              <View style={styles.rankBar}>
                <View style={[styles.rankBarFill, { width: `${100 - i * 15}%` }]} />
              </View>
            </View>
            <Text style={styles.rankPrice}>Rs. {svc.price.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.lg, gap: Spacing.sm },
  overviewCard: { width: '47%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border },
  overviewIcon: { fontSize: 26 },
  overviewValue: { fontSize: 22, fontWeight: '900' },
  overviewLabel: { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },
  section: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: Spacing.sm },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, height: 165, paddingBottom: 30 },
  barCol: { flex: 1, alignItems: 'center', position: 'relative' },
  barLabel: { color: Colors.textMuted, fontSize: 7, position: 'absolute', top: 0 },
  barWrap: { width: 22, height: 120, justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: Colors.gold, borderRadius: 4, minHeight: 8 },
  barDay: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', position: 'absolute', bottom: 0 },
  highlightCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  highlightIcon: { fontSize: 32 },
  highlightInfo: { flex: 1, gap: 2 },
  highlightTitle: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  highlightValue: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  highlightSub: { color: Colors.textSecondary, fontSize: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rankNum: { color: Colors.gold, fontWeight: '800', width: 24, fontSize: 14 },
  rankIcon: { fontSize: 20 },
  rankInfo: { flex: 1, gap: 4 },
  rankName: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  rankBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  rankBarFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 2 },
  rankPrice: { color: Colors.gold, fontSize: 13, fontWeight: '700' },
});
