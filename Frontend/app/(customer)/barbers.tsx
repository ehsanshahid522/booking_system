import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import BarberCard from '@/components/BarberCard';

export default function BarbersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const res = await apiClient.get('/barbers');
        const data = res.data?.data?.barbers || res.data?.data || [];
        setBarbers(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to fetch barbers', error);
        Alert.alert('Error', error.response?.data?.message || 'Could not fetch salon details');
      } finally {
        setLoading(false);
      }
    }
    fetchBarbers();
  }, []);

  const safeBarbers = Array.isArray(barbers) ? barbers : [];
  const filtered = safeBarbers.filter(b => {
    const nameStr = b.name || '';
    const shopStr = b.shopName || '';
    const specStr = b.specialization || '';
    return nameStr.toLowerCase().includes(search.toLowerCase()) || 
           shopStr.toLowerCase().includes(search.toLowerCase()) || 
           specStr.toLowerCase().includes(search.toLowerCase());
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
        <Text style={styles.title}>Ehsan Salon 💈</Text>
        <Text style={styles.subtitle}>142 Oxford Street, London, W1D 1LU, UK</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Search team & services..." placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: Colors.textMuted }}>✕</Text></TouchableOpacity>}
      </View>

      {/* List */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✂️</Text>
            <Text style={styles.emptyText}>No salon profiles found</Text>
          </View>
        ) : (
          filtered.map(b => (
            <BarberCard
              key={b._id}
              name={b.shopName || b.name || 'Ehsan Salon'}
              initials={(b.shopName || b.name || 'ES').substring(0, 2).toUpperCase()}
              color={Colors.gold}
              specialization={b.specialization || 'Master Barber & Luxury Grooming'}
              rating={b.rating || 4.9}
              reviewCount={b.reviewCount || 148}
              experience={b.experience || 9}
              status={b.status || 'available'}
              price={`£25+`}
              shopName={b.shopName || 'Ehsan Salon'}
              shopLocation={b.shopLocation || 'Central London, UK'}
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
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  searchInput: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 14 },
  list: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyIcon: { fontSize: 52 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
});
