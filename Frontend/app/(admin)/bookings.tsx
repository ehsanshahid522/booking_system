import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { ADMIN_BOOKINGS, BookingStatus } from '@/constants/MockData';
import StatusBadge from '@/components/StatusBadge';
import Avatar from '@/components/Avatar';

const STATUS_FILTERS: (BookingStatus | 'all')[] = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];

export default function AdminBookingsScreen() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = ADMIN_BOOKINGS.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.barber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.count}>{ADMIN_BOOKINGS.length} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search customer or barber..." placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch} />
      </View>

      {/* Status Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8, paddingVertical: 4 }}>
        {STATUS_FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map(b => (
          <View key={b.id} style={styles.bookingCard}>
            <View style={styles.bookingTop}>
              <View style={styles.bookingCustomer}>
                <View style={styles.customerDot} />
                <View>
                  <Text style={styles.customerName}>{b.customer}</Text>
                  <Text style={styles.customerInfo}>with {b.barber}</Text>
                </View>
              </View>
              <StatusBadge status={b.status} small />
            </View>
            <View style={styles.bookingDetails}>
              <Text style={styles.detailText}>✂️ {b.service}</Text>
              <Text style={styles.detailText}>📅 {b.date} · {b.time}</Text>
              <Text style={styles.detailText}>💰 Rs. {b.amount.toLocaleString()}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>View Details</Text></TouchableOpacity>
              {b.status === 'confirmed' && (
                <TouchableOpacity style={styles.cancelBtn}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
              )}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  count: { color: Colors.textSecondary, fontSize: 13 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginHorizontal: Spacing.lg, marginVertical: Spacing.sm },
  searchInput: { flex: 1, color: Colors.text, paddingVertical: 10, fontSize: 13 },
  filterScroll: {},
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: Colors.black },
  bookingCard: { backgroundColor: Colors.card, marginHorizontal: Spacing.lg, marginTop: Spacing.sm, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  bookingCustomer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  customerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold },
  customerName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  customerInfo: { color: Colors.textSecondary, fontSize: 12 },
  bookingDetails: { gap: 3, marginBottom: Spacing.sm },
  detailText: { color: Colors.textSecondary, fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  actionBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  cancelBtn: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.sm, backgroundColor: Colors.error + '18', borderWidth: 1, borderColor: Colors.error + '66' },
  cancelBtnText: { color: Colors.error, fontSize: 12, fontWeight: '600' },
});
