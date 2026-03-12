import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BARBERS, SERVICES } from '@/constants/MockData';
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
  const barber = BARBERS.find(b => b.id === barberId) || BARBERS[0];
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  const barberServices = SERVICES.filter(s => barber.services.includes(s.id));

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
          <Avatar initials={barber.initials} color={barber.color} size={90} fontSize={32} />
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.spec}>{barber.specialization}</Text>
          <StarRating rating={barber.rating} reviewCount={barber.reviewCount} size={15} />
          <View style={{ marginTop: Spacing.sm }}><StatusBadge status={barber.status} /></View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Experience', value: `${barber.experience} yrs` },
            { label: 'Rating', value: barber.rating.toFixed(1) },
            { label: 'Reviews', value: barber.reviewCount.toString() },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📝 {barber.bio}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>🕐 {barber.workingHours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>☕ Break: {barber.breakTime}</Text>
          </View>
          <View style={styles.daysRow}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
              <View key={day} style={[styles.dayChip, barber.daysAvailable.includes(day) && styles.dayActive]}>
                <Text style={[styles.dayText, barber.daysAvailable.includes(day) && styles.dayActiveText]}>{day.slice(0, 2)}</Text>
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
            {barberServices.map(s => (
              <View key={s.id} style={styles.serviceRow}>
                <Text style={styles.serviceIcon}>{s.icon}</Text>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDur}>{s.duration} min</Text>
                </View>
                <Text style={styles.servicePrice}>Rs. {s.price.toLocaleString()}</Text>
              </View>
            ))}
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
          <Text style={styles.bookPrice}>{barber.price}</Text>
          <Text style={styles.bookPriceLabel}>Starting price</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, barber.status === 'off_duty' && styles.bookBtnDisabled]}
          onPress={() => router.push({ pathname: '/(customer)/booking' as any, params: { barberId: barber.id } })}
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
