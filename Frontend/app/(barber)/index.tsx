import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { TODAY_SCHEDULE, BOOKING_REQUESTS, BARBERS } from '@/constants/MockData';
import StatusBadge from '@/components/StatusBadge';
import Avatar from '@/components/Avatar';

const barber = BARBERS[0];

export default function BarberDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const completed = TODAY_SCHEDULE.filter(a => a.status === 'completed').length;
  const upcoming = TODAY_SCHEDULE.filter(a => a.status === 'confirmed').length;
  const earnedToday = TODAY_SCHEDULE.filter(a => a.status === 'completed').reduce((s, a) => s + a.amount, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Barber Panel 💈</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <View style={[styles.statusBadge, barber.status === 'available' && styles.statusAvailable]}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{barber.status === 'available' ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        {[
          { label: 'Today Done', value: completed.toString(), icon: '✅', color: Colors.success },
          { label: 'Upcoming', value: upcoming.toString(), icon: '⏳', color: Colors.info },
          { label: 'Requests', value: BOOKING_REQUESTS.length.toString(), icon: '📩', color: Colors.warning },
          { label: 'Earned', value: `Rs. ${earnedToday.toLocaleString()}`, icon: '💰', color: Colors.gold },
        ].map(kpi => (
          <View key={kpi.label} style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>{kpi.icon}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      {/* Today's Schedule Preview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => router.push('/(barber)/schedule' as any)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {TODAY_SCHEDULE.slice(0, 3).map(slot => (
        <View key={slot.id} style={styles.scheduleRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{slot.time}</Text>
            <Text style={styles.timeEnd}>{slot.endTime}</Text>
          </View>
          <View style={styles.scheduleLine} />
          <View style={styles.scheduleCard}>
            <Avatar initials={slot.customerInitials} color={slot.customerColor} size={38} fontSize={13} />
            <View style={styles.scheduleInfo}>
              <Text style={styles.customerName}>{slot.customerName}</Text>
              <Text style={styles.serviceName}>{slot.service}</Text>
            </View>
            <View style={styles.scheduleRight}>
              <Text style={styles.scheduleAmount}>Rs. {slot.amount.toLocaleString()}</Text>
              <StatusBadge status={slot.status} small />
            </View>
          </View>
        </View>
      ))}

      {/* Pending Requests */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        <TouchableOpacity onPress={() => router.push('/(barber)/requests' as any)}>
          <Text style={styles.seeAll}>See All ({BOOKING_REQUESTS.length})</Text>
        </TouchableOpacity>
      </View>

      {BOOKING_REQUESTS.slice(0, 2).map(req => (
        <View key={req.id} style={styles.requestCard}>
          <Avatar initials={req.customerInitials} color={req.customerColor} size={44} fontSize={15} />
          <View style={styles.requestInfo}>
            <Text style={styles.reqCustomer}>{req.customerName}</Text>
            <Text style={styles.reqService}>{req.service}</Text>
            <Text style={styles.reqDate}>📅 {req.date} · {req.time}</Text>
          </View>
          <View style={styles.reqButtons}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptText}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn}>
              <Text style={styles.rejectText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Quick Links */}
      <View style={styles.quickLinks}>
        {[
          { label: 'Calendar', icon: '📅', route: '/(barber)/calendar' },
          { label: 'Earnings', icon: '💰', route: '/(barber)/earnings' },
        ].map(link => (
          <TouchableOpacity key={link.label} style={styles.quickLink} onPress={() => router.push(link.route as any)}>
            <Text style={styles.quickLinkIcon}>{link.icon}</Text>
            <Text style={styles.quickLinkLabel}>{link.label}</Text>
            <Text style={styles.quickLinkArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  greeting: { color: Colors.textSecondary, fontSize: 13 },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.card, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: Colors.border },
  statusAvailable: { borderColor: Colors.success + '66', backgroundColor: Colors.success + '11' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  statusText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  kpiCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: Colors.border },
  kpiIcon: { fontSize: 22 },
  kpiValue: { fontSize: 14, fontWeight: '800' },
  kpiLabel: { color: Colors.textMuted, fontSize: 10, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '800' },
  seeAll: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  timeBox: { width: 60, alignItems: 'flex-end', marginRight: 8 },
  timeText: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  timeEnd: { color: Colors.textMuted, fontSize: 10 },
  scheduleLine: { width: 2, height: 48, backgroundColor: Colors.gold + '44', marginRight: 8 },
  scheduleCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.sm, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  scheduleInfo: { flex: 1 },
  customerName: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  serviceName: { color: Colors.textSecondary, fontSize: 12 },
  scheduleRight: { alignItems: 'flex-end', gap: 3 },
  scheduleAmount: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  requestCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  requestInfo: { flex: 1, gap: 2 },
  reqCustomer: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  reqService: { color: Colors.textSecondary, fontSize: 13 },
  reqDate: { color: Colors.textMuted, fontSize: 12 },
  reqButtons: { flexDirection: 'row', gap: 6 },
  acceptBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.success },
  acceptText: { color: Colors.success, fontWeight: '800', fontSize: 14 },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.error + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.error },
  rejectText: { color: Colors.error, fontWeight: '800', fontSize: 14 },
  quickLinks: { marginHorizontal: Spacing.lg, marginTop: Spacing.sm, gap: Spacing.sm },
  quickLink: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  quickLinkIcon: { fontSize: 22 },
  quickLinkLabel: { flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' },
  quickLinkArrow: { color: Colors.textMuted, fontSize: 20 },
});
