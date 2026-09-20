import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ActivityIndicator, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import StatusBadge from '@/components/StatusBadge';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Hair', 'Beard', 'Wellness', 'Combo'];

export default function CustomerHome() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('All');
  const [primaryBarber, setPrimaryBarber] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [servicesRes, barberRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/barbers/primary')
      ]);
      
      const sData = servicesRes.data?.data?.services || servicesRes.data?.data || [];
      const bData = barberRes.data?.data?.barber || null;

      setServices(Array.isArray(sData) ? sData : []);
      setPrimaryBarber(bData);
    } catch (e) {
      console.error('Failed to fetch home data:', e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  const safeServices = Array.isArray(services) ? services : [];

  const filteredServices = selectedCat === 'All'
    ? safeServices
    : safeServices.filter(s => s && s.category === selectedCat);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  const shopName = primaryBarber?.shopName || 'Ehsan Salon';
  const shopLocation = primaryBarber?.shopLocation || '142 Oxford Street, London, W1D 1LU, UK';
  const shopRating = primaryBarber?.rating || 4.9;
  const shopReviews = primaryBarber?.reviewCount || 148;
  const shopStatus = primaryBarber?.status || 'available';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.name}>{shopName} 💈</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(customer)/notifications' as any)}>
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Salon Showcase Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <View style={styles.salonBadgeContainer}>
            <Text style={styles.salonBadgeText}>PREMIER UK SALON</Text>
          </View>
          <StatusBadge status={shopStatus} />
        </View>

        <Text style={styles.heroTitle}>{shopName}</Text>
        <Text style={styles.heroLoc}>📍 {shopLocation}</Text>
        <Text style={styles.heroHours}>⏰ Open Today: 09:00 AM - 08:00 PM</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.starText}>★ {shopRating.toFixed(1)}</Text>
          <Text style={styles.reviewText}>({shopReviews} reviews)</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.tagText}>Central London</Text>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.heroActionsRow}>
          <TouchableOpacity
            style={styles.heroBookBtn}
            onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { barberId: primaryBarber?._id } })}
            activeOpacity={0.85}
          >
            <Text style={styles.heroBookText}>Book Appointment ✂️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroCallBtn}
            onPress={() => Linking.openURL('tel:+447700900077')}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCallText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Offer Banner */}
      <View style={styles.promoBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.promoTitle}>Special Treatment Package 🎉</Text>
          <Text style={styles.promoSub}>Full VIP Grooming with Hot Towel & Facial</Text>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => router.push('/(customer)/services' as any)}
          >
            <Text style={styles.promoBtnText}>View Menu →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.promoEmoji}>🪒</Text>
      </View>

      {/* Services Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Salon Services & Menu</Text>
        <TouchableOpacity onPress={() => router.push('/(customer)/services' as any)}>
          <Text style={styles.seeAll}>View All</Text>
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

      {/* Services List Grid */}
      <View style={styles.servicesGrid}>
        {filteredServices.length === 0 ? (
          <Text style={{ color: Colors.textMuted, paddingHorizontal: Spacing.lg }}>No services found in this category.</Text>
        ) : (
          filteredServices.map(svc => (
            <View key={svc._id} style={styles.serviceItemCard}>
              <View style={styles.svcLeft}>
                <View style={styles.svcIconCircle}>
                  <Text style={styles.svcIconEmoji}>{svc.icon || '✂️'}</Text>
                </View>
                <View style={styles.svcTextDetails}>
                  <Text style={styles.svcItemTitle}>{svc.name}</Text>
                  <Text style={styles.svcItemSub}>{svc.description || 'Professional styling service'}</Text>
                  <Text style={styles.svcDuration}>⏱ {svc.duration} minutes</Text>
                </View>
              </View>

              <View style={styles.svcRight}>
                <Text style={styles.svcPriceTag}>£{svc.price}</Text>
                <TouchableOpacity
                  style={styles.bookSmallBtn}
                  onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { serviceId: svc._id, barberId: primaryBarber?._id } })}
                >
                  <Text style={styles.bookSmallText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Why Choose Ehsan Salon */}
      <View style={styles.whySection}>
        <Text style={styles.whyTitle}>Why Choose {shopName}?</Text>
        <View style={styles.whyGrid}>
          <View style={styles.whyCard}>
            <Text style={styles.whyEmoji}>💈</Text>
            <Text style={styles.whyCardTitle}>Master Barbers</Text>
            <Text style={styles.whyCardSub}>Certified British & International stylists</Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={styles.whyEmoji}>☕</Text>
            <Text style={styles.whyCardTitle}>VIP Lounge</Text>
            <Text style={styles.whyCardSub}>Complimentary espresso & refreshments</Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={styles.whyEmoji}>🔥</Text>
            <Text style={styles.whyCardTitle}>Hot Towel Shave</Text>
            <Text style={styles.whyCardSub}>Traditional luxury razor & aromatherapy</Text>
          </View>

          <View style={styles.whyCard}>
            <Text style={styles.whyEmoji}>⭐</Text>
            <Text style={styles.whyCardTitle}>4.9 Star Rated</Text>
            <Text style={styles.whyCardSub}>Over 140+ verified client reviews</Text>
          </View>
        </View>
      </View>

      {/* Quick Direct Book Banner */}
      <TouchableOpacity
        style={styles.quickBookBanner}
        onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { barberId: primaryBarber?._id } })}
        activeOpacity={0.85}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.quickBookTitle}>Book Your Appointment ✂️</Text>
          <Text style={styles.quickBookSub}>Reserve your slot at Ehsan Salon in under 30 seconds</Text>
        </View>
        <Text style={styles.quickBookArrow}>→</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
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

  // Hero Salon Showcase
  heroCard: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '44', marginBottom: Spacing.lg, gap: 6 },
  heroHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  salonBadgeContainer: { backgroundColor: Colors.gold + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.gold + '55' },
  salonBadgeText: { color: Colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  heroLoc: { color: Colors.textSecondary, fontSize: 13 },
  heroHours: { color: Colors.textMuted, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  starText: { color: Colors.gold, fontWeight: '800', fontSize: 14 },
  reviewText: { color: Colors.textSecondary, fontSize: 12 },
  dotSeparator: { color: Colors.textMuted, fontSize: 12 },
  tagText: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
  heroActionsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  heroBookBtn: { flex: 1, backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 12, alignItems: 'center' },
  heroBookText: { color: Colors.black, fontWeight: '800', fontSize: 14 },
  heroCallBtn: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center' },
  heroCallText: { color: Colors.text, fontWeight: '700', fontSize: 14 },

  // Promo Banner
  promoBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.goldDark + '22', borderRadius: Radius.md, marginHorizontal: Spacing.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '33', marginBottom: Spacing.lg },
  promoTitle: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  promoSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2, marginBottom: Spacing.sm },
  promoBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'flex-start' },
  promoBtnText: { color: Colors.black, fontSize: 12, fontWeight: '700' },
  promoEmoji: { fontSize: 44 },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  seeAll: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  catScroll: { marginBottom: Spacing.md },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  catText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  catTextActive: { color: Colors.black },

  // Services List Grid
  servicesGrid: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.xl },
  serviceItemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  svcLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  svcIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  svcIconEmoji: { fontSize: 20 },
  svcTextDetails: { flex: 1 },
  svcItemTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  svcItemSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 1 },
  svcDuration: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  svcRight: { alignItems: 'flex-end', gap: 6, marginLeft: 8 },
  svcPriceTag: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  bookSmallBtn: { backgroundColor: Colors.gold + '22', borderWidth: 1, borderColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 4, paddingHorizontal: 12 },
  bookSmallText: { color: Colors.gold, fontSize: 12, fontWeight: '800' },

  // Why Choose Us
  whySection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  whyTitle: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: Spacing.md },
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  whyCard: { width: (width - Spacing.lg * 2 - Spacing.sm) / 2, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: 4 },
  whyEmoji: { fontSize: 24, marginBottom: 2 },
  whyCardTitle: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  whyCardSub: { color: Colors.textMuted, fontSize: 11, lineHeight: 15 },

  // Quick Book Banner
  quickBookBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.lg, marginHorizontal: Spacing.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '66', gap: Spacing.sm },
  quickBookTitle: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  quickBookSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  quickBookArrow: { color: Colors.gold, fontSize: 22, fontWeight: '800' },
});
