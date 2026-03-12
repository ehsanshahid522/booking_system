import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BOOKINGS, BookingStatus } from '@/constants/MockData';
import BookingCard from '@/components/BookingCard';

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'Upcoming', statuses: ['pending', 'confirmed', 'rescheduled'] },
  { label: 'Completed', statuses: ['completed'] },
  { label: 'Cancelled', statuses: ['cancelled', 'rejected', 'no_show'] },
];

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = BOOKINGS.filter(b => TABS[activeTab].statuses.includes(b.status));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity style={styles.plusBtn} onPress={() => router.push('/(customer)/booking' as any)}>
          <Text style={styles.plusText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t.label} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t.label}</Text>
            <View style={[styles.tabBadge, activeTab === i && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === i && { color: Colors.black }]}>
                {BOOKINGS.filter(b => t.statuses.includes(b.status)).length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No {TABS[activeTab].label} Bookings</Text>
            <Text style={styles.emptySub}>Your {TABS[activeTab].label.toLowerCase()} appointments will appear here</Text>
            {activeTab === 0 && (
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(customer)/booking' as any)}>
                <Text style={styles.emptyBtnText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map(b => (
            <BookingCard
              key={b.id}
              {...b}
              onPress={() => router.push({ pathname: '/(customer)/booking-detail' as any, params: { bookingId: b.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  plusBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 8, paddingHorizontal: 16 },
  plusText: { color: Colors.black, fontWeight: '700', fontSize: 13 },
  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.sm },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.gold + '18', borderColor: Colors.gold },
  tabText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: Colors.gold },
  tabBadge: { backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: Colors.gold },
  tabBadgeText: { color: Colors.textSecondary, fontSize: 10, fontWeight: '700' },
  list: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md, paddingHorizontal: Spacing.lg },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  emptySub: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 28, marginTop: Spacing.sm },
  emptyBtnText: { color: Colors.black, fontWeight: '700', fontSize: 14 },
});
