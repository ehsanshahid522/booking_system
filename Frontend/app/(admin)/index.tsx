import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { ADMIN_STATS, ADMIN_BOOKINGS, WEEK_REVENUE, BARBERS } from '@/constants/MockData';
import StatusBadge from '@/components/StatusBadge';
import Avatar from '@/components/Avatar';

const maxV = Math.max(...WEEK_REVENUE.map(d => d.amount));

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel 🛡️</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logLink} onPress={() => router.push('/(admin)/communication' as any)}>
          <Text style={styles.logText}>📢</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {[
          { label: 'Total Bookings', value: ADMIN_STATS.totalBookings.toString(), icon: '📅', color: Colors.info },
          { label: "Today's Apts", value: ADMIN_STATS.todayAppointments.toString(), icon: '⏳', color: Colors.warning },
          { label: 'Active Barbers', value: ADMIN_STATS.activeBarbers.toString(), icon: '💈', color: Colors.gold },
          { label: 'Customers', value: ADMIN_STATS.totalCustomers.toString(), icon: '👥', color: Colors.success },
          { label: 'Month Revenue', value: `Rs. ${(ADMIN_STATS.monthRevenue / 1000).toFixed(0)}k`, icon: '💰', color: Colors.gold },
          { label: 'Avg Rating', value: ADMIN_STATS.avgRating.toString(), icon: '⭐', color: Colors.warning },
          { label: 'Cancel Rate', value: ADMIN_STATS.cancelRate, icon: '❌', color: Colors.error },
          { label: 'Total Revenue', value: `Rs. ${(ADMIN_STATS.totalRevenue / 1000).toFixed(0)}k`, icon: '📈', color: Colors.success },
        ].map(kpi => (
          <View key={kpi.label} style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>{kpi.icon}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Weekly Revenue</Text>
        <View style={styles.chart}>
          {WEEK_REVENUE.map(d => {
            const h = (d.amount / maxV) * 100;
            return (
              <View key={d.day} style={styles.barCol}>
                <Text style={styles.barVal}>Rs.{Math.round(d.amount / 1000)}k</Text>
                <View style={styles.barWrap}>
                  <View style={[styles.bar, { height: h }]} />
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Recent Bookings */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <TouchableOpacity onPress={() => router.push('/(admin)/bookings' as any)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {ADMIN_BOOKINGS.slice(0, 3).map(b => (
        <View key={b.id} style={styles.bookingRow}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingCustomer}>{b.customer}</Text>
            <Text style={styles.bookingMeta}>{b.service} · {b.barber}</Text>
            <Text style={styles.bookingTime}>🕐 {b.date} {b.time}</Text>
          </View>
          <View style={styles.bookingRight}>
            <Text style={styles.bookingAmount}>Rs. {b.amount.toLocaleString()}</Text>
            <StatusBadge status={b.status} small />
          </View>
        </View>
      ))}

      {/* Quick Links */}
      <View style={styles.quickGrid}>
        {[
          { icon: '👥', label: 'Customers', route: '/(admin)/customers' },
          { icon: '💳', label: 'Payments', route: '/(admin)/payments' },
          { icon: '📊', label: 'Reports', route: '/(admin)/reports' },
          { icon: '📢', label: 'Broadcast', route: '/(admin)/communication' },
        ].map(link => (
          <TouchableOpacity key={link.label} style={styles.quickLink} onPress={() => router.push(link.route as any)}>
            <Text style={styles.quickIcon}>{link.icon}</Text>
            <Text style={styles.quickLabel}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top Barbers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Barbers</Text>
      </View>
      {BARBERS.slice(0, 3).map((b, i) => (
        <View key={b.id} style={styles.topBarberRow}>
          <Text style={styles.rank}>#{i + 1}</Text>
          <Avatar initials={b.initials} color={b.color} size={38} fontSize={13} />
          <View style={styles.topBarberInfo}>
            <Text style={styles.topBarberName}>{b.name}</Text>
            <Text style={styles.topBarberSpec}>{b.specialization}</Text>
          </View>
          <Text style={styles.topBarberRating}>⭐ {b.rating}</Text>
        </View>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  greeting: { color: Colors.textSecondary, fontSize: 13 },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
  logLink: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  logText: { fontSize: 20 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.lg, gap: Spacing.sm },
  kpiCard: { width: '23%', backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.sm, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: Colors.border },
  kpiIcon: { fontSize: 20 },
  kpiValue: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  kpiLabel: { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  chartSection: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '800', marginBottom: Spacing.sm },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, height: 150, paddingBottom: 28 },
  barCol: { flex: 1, alignItems: 'center', position: 'relative' },
  barVal: { color: Colors.textMuted, fontSize: 7, position: 'absolute', top: 0 },
  barWrap: { width: 20, height: 110, justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: Colors.gold, borderRadius: 3, minHeight: 6 },
  barDay: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', position: 'absolute', bottom: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  seeAll: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  bookingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  bookingInfo: {},
  bookingCustomer: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  bookingMeta: { color: Colors.textSecondary, fontSize: 12 },
  bookingTime: { color: Colors.textMuted, fontSize: 11 },
  bookingRight: { alignItems: 'flex-end', gap: 4 },
  bookingAmount: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
  quickGrid: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginVertical: Spacing.md },
  quickLink: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border },
  quickIcon: { fontSize: 24 },
  quickLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  topBarberRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rank: { color: Colors.gold, fontWeight: '800', fontSize: 16, width: 28 },
  topBarberInfo: { flex: 1 },
  topBarberName: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  topBarberSpec: { color: Colors.textSecondary, fontSize: 11 },
  topBarberRating: { color: Colors.gold, fontWeight: '700', fontSize: 13 },
});
