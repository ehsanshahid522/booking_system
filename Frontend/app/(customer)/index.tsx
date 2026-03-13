import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import BarberCard from '@/components/BarberCard';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Hair', 'Beard', 'Skin', 'Wellness', 'Combo'];

export default function CustomerHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState('All');
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [servicesRes, barbersRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/barbers?limit=5')
      ]);
      
      const sData = servicesRes.data?.data?.services || servicesRes.data?.data || [];
      const bData = barbersRes.data?.data?.barbers || barbersRes.data?.data || [];

      setServices(Array.isArray(sData) ? sData : []);
      setBarbers(Array.isArray(bData) ? bData : []);
    } catch (e) {
      console.error('Failed to fetch home data:', e);
      setBarbers([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  const firstName = user?.name?.split(' ')[0] || 'Guest';
  const safeServices = Array.isArray(services) ? services : [];
  const safeBarbers = Array.isArray(barbers) ? barbers : [];

  const filteredServices = selectedCat === 'All'
    ? safeServices.slice(0, 6)
    : safeServices.filter(s => s && s.category === selectedCat).slice(0, 6);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(customer)/notifications' as any)}>
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search barbers, services..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View>
          <Text style={styles.promoTitle}>Friday Special 🎉</Text>
          <Text style={styles.promoSub}>20% off on all beard services</Text>
          <TouchableOpacity style={styles.promoBtn} onPress={() => router.push('/(customer)/services' as any)}>
            <Text style={styles.promoBtnText}>Book Now →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.promoEmoji}>🪒</Text>
      </View>

      {/* Service Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity onPress={() => router.push('/(customer)/services' as any)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: 8 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceScroll} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
        {filteredServices.length === 0 ? (
          <Text style={{ color: Colors.textMuted }}>No services available.</Text>
        ) : (
          filteredServices.map(svc => (
            <TouchableOpacity
              key={svc._id}
              style={styles.serviceCard}
              onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { serviceId: svc._id } })}
              activeOpacity={0.8}
            >
              <View style={styles.svcIconBox}>
                <Text style={styles.svcIcon}>✨</Text>
              </View>
              <Text style={styles.svcName}>{svc.name}</Text>
              <Text style={styles.svcPrice}>Rs. {svc.price}</Text>
              <Text style={styles.svcDuration}>⏱ {svc.duration} min</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Featured Barbers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Barbers</Text>
        <TouchableOpacity onPress={() => router.push('/(customer)/barbers' as any)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.barbersList}>
        {safeBarbers.length === 0 ? (
          <Text style={{ color: Colors.textMuted, textAlign: 'center', padding: Spacing.lg }}>No barbers found.</Text>
        ) : (
          safeBarbers.slice(0, 3).map(barber => (
            <BarberCard
              key={barber._id}
              name={barber.name}
              initials={barber.name?.substring(0, 2).toUpperCase() || 'BB'}
              color={Colors.gold}
              specialization={barber.specialization || 'Expert Barber'}
              rating={barber.rating || 0}
              reviewCount={barber.reviewCount || 0}
              experience={barber.experience || 0}
              status={barber.status || 'available'}
              price={`Rs. 500+`}
              onPress={() => router.push({ pathname: '/(customer)/barber-detail' as any, params: { barberId: barber._id } })}
            />
          ))
        )}
      </View>

      {/* Quick Book Banner */}
      <TouchableOpacity style={styles.quickBookBanner} onPress={() => router.push('/(customer)/booking' as any)} activeOpacity={0.85}>
        <Text style={styles.quickBookTitle}>Quick Book ✂️</Text>
        <Text style={styles.quickBookSub}>Let us find the best barber for you right now</Text>
        <Text style={styles.quickBookArrow}>→</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  greeting: { color: Colors.textSecondary, fontSize: 14 },
  name: { color: Colors.text, fontSize: 24, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  iconText: { fontSize: 18 },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 9, height: 9, borderRadius: 4.5, backgroundColor: Colors.gold, borderWidth: 1.5, borderColor: Colors.background },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.text, paddingVertical: 12, fontSize: 14 },
  promoBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.goldDark + '33', borderRadius: Radius.md, marginHorizontal: Spacing.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '44', marginBottom: Spacing.lg },
  promoTitle: { color: Colors.gold, fontSize: 18, fontWeight: '800' },
  promoSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 4, marginBottom: Spacing.sm },
  promoBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 7, paddingHorizontal: 16, alignSelf: 'flex-start' },
  promoBtnText: { color: Colors.black, fontSize: 13, fontWeight: '700' },
  promoEmoji: { fontSize: 52 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  seeAll: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  catScroll: { marginBottom: Spacing.md },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  catText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  catTextActive: { color: Colors.black },
  serviceScroll: { marginBottom: Spacing.lg },
  serviceCard: { width: 130, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 4 },
  svcIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 4, borderWidth: 1, borderColor: Colors.border },
  svcIcon: { fontSize: 24 },
  svcName: { color: Colors.text, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  svcPrice: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  svcDuration: { color: Colors.textMuted, fontSize: 11 },
  barbersList: { paddingHorizontal: Spacing.lg },
  quickBookBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '33', gap: Spacing.sm },
  quickBookTitle: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  quickBookSub: { color: Colors.textSecondary, fontSize: 12, flex: 1, marginTop: 2 },
  quickBookArrow: { color: Colors.gold, fontSize: 20, fontWeight: '800' },
});
