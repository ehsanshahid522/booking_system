import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import ServiceCard from '@/components/ServiceCard';

const CATEGORIES = ['All', 'Hair', 'Beard', 'Skin', 'Wellness', 'Combo'];

export default function ServicesScreen() {
  const router = useRouter();
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await apiClient.get('/services');
        const data = res.data?.data?.services || res.data?.data || [];
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const safeServices = Array.isArray(services) ? services : [];
  const filtered = cat === 'All' ? safeServices : safeServices.filter(s => s && s.category === cat);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Our Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8, paddingVertical: 4 }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} style={[styles.chip, cat === c && styles.chipActive]} onPress={() => setCat(c)}>
            <Text style={[styles.chipText, cat === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={{ color: Colors.textMuted, textAlign: 'center', marginTop: 40 }}>No services found</Text>
        ) : (
          <View style={styles.grid}>
            {filtered.map(svc => (
              <ServiceCard
                key={svc._id}
                name={svc.name || 'Service'}
                price={svc.price || 0}
                duration={svc.duration || 0}
                icon="✨"
                category={svc.category || ''}
                selected={selected === svc._id}
                onPress={() => setSelected(svc._id === selected ? '' : svc._id)}
              />
            ))}
          </View>
        )}

        {selected && (
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { serviceId: selected } })}
          >
            <Text style={styles.bookBtnText}>Book Selected Service →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  title: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  catScroll: { marginBottom: Spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: Colors.black },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'space-between' },
  bookBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.lg },
  bookBtnText: { color: Colors.black, fontWeight: '800', fontSize: 15 },
});
