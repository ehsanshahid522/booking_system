import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BARBERS } from '@/constants/MockData';
import BarberCard from '@/components/BarberCard';

const FILTERS = ['All', 'Available', 'Hair', 'Beard', 'Styling'];

export default function BarbersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = BARBERS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.specialization.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Available' && b.status === 'available') || b.specialization.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Barbers</Text>
        <Text style={styles.subtitle}>{BARBERS.length} professionals ready for you</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search barbers..." placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: Colors.textMuted }}>✕</Text></TouchableOpacity>}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8, paddingVertical: 4 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✂️</Text>
            <Text style={styles.emptyText}>No barbers found</Text>
          </View>
        ) : (
          filtered.map(b => (
            <BarberCard
              key={b.id}
              {...b}
              onPress={() => router.push({ pathname: '/(customer)/barber-detail' as any, params: { barberId: b.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  searchInput: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 14 },
  filterScroll: { marginBottom: Spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: Colors.black },
  list: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyIcon: { fontSize: 52 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
});
