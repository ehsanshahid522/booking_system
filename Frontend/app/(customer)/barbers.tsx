import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import BarberCard from '@/components/BarberCard';

const FILTERS = ['All', 'Available', 'Hair', 'Beard', 'Styling'];

export default function BarbersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const res = await apiClient.get('/barbers');
        const data = res.data?.data?.barbers || res.data?.data || [];
        setBarbers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch barbers', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBarbers();
  }, []);

  const safeBarbers = Array.isArray(barbers) ? barbers : [];
  const filtered = safeBarbers.filter(b => {
    const nameStr = b.name || '';
    const specStr = b.specialization || '';
    const matchSearch = nameStr.toLowerCase().includes(search.toLowerCase()) || specStr.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Available' && b.status === 'available') || specStr.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Barbers</Text>
        <Text style={styles.subtitle}>{safeBarbers.length} professionals ready for you</Text>
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
              key={b._id}
              name={b.name || 'Barber'}
              initials={b.name?.substring(0, 2).toUpperCase() || 'BB'}
              color={Colors.gold}
              specialization={b.specialization || 'Expert Barber'}
              rating={b.rating || 0}
              reviewCount={b.reviewCount || 0}
              experience={b.experience || 0}
              status={b.status || 'available'}
              price={`Rs. 500+`}
              shopName={b.shopName}
              shopLocation={b.shopLocation}
              onPress={() => router.push({ pathname: '/(customer)/barber-detail' as any, params: { barberId: b._id } })}
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
