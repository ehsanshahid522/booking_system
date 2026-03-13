import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import Avatar from '@/components/Avatar';
import StarRating from '@/components/StarRating';
import StatusBadge from '@/components/StatusBadge';

const REVIEWS = [
  { id: 1, name: 'Ali R.', rating: 5, comment: 'Best haircut I\'ve ever had! Really knows his craft.', date: '2 days ago' },
  { id: 2, name: 'Hassan S.', rating: 5, comment: 'Very professional and on time. Will book again.', date: '1 week ago' },
  { id: 3, name: 'Kamran M.', rating: 4, comment: 'Great service, shop is clean and well maintained.', date: '2 weeks ago' },
];

export default function BarberDetailScreen() {
  const router = useRouter();
  const { barberId } = useLocalSearchParams<{ barberId: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [barber, setBarber] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarber() {
      try {
        const res = await apiClient.get(`/barbers/${barberId}`);
        setBarber(res.data.data);
      } catch (error) {
        console.error('Failed to fetch barber details', error);
      } finally {
        setLoading(false);
      }
    }
    if (barberId) fetchBarber();
  }, [barberId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!barber) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textMuted }}>Barber not found.</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: Colors.gold }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const barberServices = Array.isArray(barber.services) ? barber.services : [];
  const daysAvailable = Array.isArray(barber.daysAvailable) ? barber.daysAvailable : [];

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Barber Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar initials={barber.name?.substring(0, 2).toUpperCase() || 'BB'} color={Colors.gold} size={90} fontSize={32} />
          <Text style={styles.barberName}>{barber.name || 'Barber'}</Text>
          {barber.shopName ? <Text style={styles.shopDetailName}>📍 {barber.shopName}</Text> : null}
          {barber.shopLocation ? <Text style={styles.shopDetailLoc}>{barber.shopLocation}</Text> : null}
          <Text style={styles.spec}>{barber.specialization || 'Expert Barber'}</Text>
          <StarRating rating={barber.rating || 0} reviewCount={barber.reviewCount || 0} size={15} />
          <View style={{ marginTop: Spacing.sm }}><StatusBadge status={barber.status || 'available'} /></View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Experience', value: `${barber.experience || 0} yrs` },
            { label: 'Rating', value: (barber.rating || 0).toFixed(1) },
            { label: 'Reviews', value: (barber.reviewCount || 0).toString() },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📝 {barber.bio || 'No bio available.'}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>🕐 {barber.workingHours || '10:00 AM - 08:00 PM'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>☕ Break: {barber.breakTime || 'None'}</Text>
          </View>
          <View style={styles.daysRow}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
              <View key={day} style={[styles.dayChip, daysAvailable.includes(day) && styles.dayActive]}>
                <Text style={[styles.dayText, daysAvailable.includes(day) && styles.dayActiveText]}>{day.slice(0, 2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['info', 'reviews'] as const).map(t => (
            <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t === 'info' ? 'Services' : 'Reviews'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'info' ? (
          <View style={styles.section}>
            {barberServices.length === 0 ? (
              <Text style={{ color: Colors.textMuted, textAlign: 'center' }}>No services available.</Text>
            ) : (
              barberServices.map((s: any) => (
                <View key={s._id || Math.random().toString()} style={styles.serviceRow}>
                  <Text style={styles.serviceIcon}>{s.service?.icon || '✂️'}</Text>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{s.service?.name || 'Service'}</Text>
                    <Text style={styles.serviceDur}>{s.service?.duration || 0} min</Text>
                  </View>
                  <Text style={styles.servicePrice}>Rs. {s.customPrice?.toLocaleString() || 0}</Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.section}>
            {REVIEWS.map(r => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookBar}>
        <View>
          <Text style={styles.bookPrice}>Rs. {barber.services?.[0]?.customPrice?.toLocaleString() || '500'}+</Text>
          <Text style={styles.bookPriceLabel}>Starting price</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, barber.status === 'off_duty' && styles.bookBtnDisabled]}
          onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { barberId: barber._id } })}
          disabled={barber.status === 'off_duty'}
        >
          <Text style={styles.bookBtnText}>{barber.status === 'off_duty' ? 'Off Duty' : 'Book Now ✂️'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  topBarTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  profileHeader: { alignItems: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.sm },
  barberName: { color: Colors.text, fontSize: 24, fontWeight: '800', marginTop: Spacing.sm },
  shopDetailName: { color: Colors.gold, fontSize: 16, fontWeight: '700', marginTop: 4 },
  shopDetailLoc: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  spec: { color: Colors.textSecondary, fontSize: 14 },
  statsRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { color: Colors.gold, fontSize: 20, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 12 },
  infoCard: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, gap: Spacing.sm },
  infoRow: {},
  infoText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
  daysRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  dayChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  dayActive: { backgroundColor: Colors.gold + '22', borderColor: Colors.gold },
  dayText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  dayActiveText: { color: Colors.gold },
  tabs: { flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: 4, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  tab: { flex: 1, paddingVertical: 8, borderRadius: Radius.sm - 2, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.gold },
  tabText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: Colors.black },
  section: { paddingHorizontal: Spacing.lg },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  serviceIcon: { fontSize: 24 },
  serviceInfo: { flex: 1 },
  serviceName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  serviceDur: { color: Colors.textSecondary, fontSize: 12 },
  servicePrice: { color: Colors.gold, fontWeight: '700', fontSize: 14 },
  reviewCard: { backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, gap: 4 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewName: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  reviewDate: { color: Colors.textMuted, fontSize: 12 },
  reviewStars: { color: Colors.gold, fontSize: 14 },
  reviewComment: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: 28 },
  bookPrice: { color: Colors.gold, fontSize: 18, fontWeight: '800' },
  bookPriceLabel: { color: Colors.textMuted, fontSize: 12 },
  bookBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 13, paddingHorizontal: 28 },
  bookBtnDisabled: { backgroundColor: Colors.textMuted },
  bookBtnText: { color: Colors.black, fontWeight: '800', fontSize: 15 },
});
