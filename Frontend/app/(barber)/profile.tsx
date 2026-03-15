import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import Avatar from '@/components/Avatar';

export default function BarberProfileScreen() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState(user?.status || 'available');

  const STATUS_OPTIONS = ['available', 'busy', 'off_duty'] as const;

  const initials = user?.name?.substring(0, 2).toUpperCase() || 'BB';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar initials={initials} color={Colors.gold} size={88} fontSize={32} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.spec}>{user?.specialization || 'Professional Barber'}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{user?.rating || 5.0} · {user?.reviewCount || 0} reviews</Text>
        </View>
        {user?.shopName ? <Text style={styles.shopDetail}>📍 {user.shopName}</Text> : null}
      </View>

      {/* Status Toggle */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionLabel}>My Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map(s => (
            <TouchableOpacity key={s} style={[styles.statusBtn, status === s && styles.statusBtnActive]} onPress={() => setStatus(s)}>
              <Text style={styles.statusBtnText}>{s === 'available' ? '🟢 Online' : s === 'busy' ? '🟡 Busy' : '🔴 Off Duty'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionLabel}>Profile Info</Text>
        {[
          { label: 'Experience', value: `${user?.experience || 0} years`, icon: '⏱' },
          { label: 'Working Hours', value: user?.workingHours || '09:00 AM - 06:00 PM', icon: '🕐' },
          { label: 'Location', value: user?.shopLocation || 'Not set', icon: '📍' },
          { label: 'Email', value: user?.email, icon: '📧' },
        ].map(item => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoIcon}>{item.icon}</Text>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Bio */}
      <View style={styles.bioCard}>
        <Text style={styles.sectionLabel}>Bio</Text>
        <Text style={styles.bioText}>{user?.bio || 'No bio provided yet.'}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>✏️ Edit Bio</Text>
        </TouchableOpacity>
      </View>

      {/* Days Available */}
      <View style={styles.daysSection}>
        <Text style={styles.sectionLabel}>Working Days</Text>
        <View style={styles.daysRow}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
            const isAvailable = user?.daysAvailable?.includes(day);
            return (
              <View key={day} style={[styles.dayChip, isAvailable && styles.dayActive]}>
                <Text style={[styles.dayText, isAvailable && styles.dayActiveText]}>{day.slice(0, 2)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ])}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingTop: 56, paddingBottom: Spacing.lg, gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  spec: { color: Colors.textSecondary, fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  star: { color: Colors.gold, fontSize: 16 },
  rating: { color: Colors.textSecondary, fontSize: 13 },
  shopDetail: { color: Colors.gold, fontSize: 14, fontWeight: '600', marginTop: 4 },
  statusSection: { padding: Spacing.lg },
  sectionLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
  statusRow: { flexDirection: 'row', gap: Spacing.sm },
  statusBtn: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.sm, paddingVertical: 10, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  statusBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
  statusBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  infoCard: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoIcon: { fontSize: 18, width: 28 },
  infoLabel: { flex: 1, color: Colors.textSecondary, fontSize: 14 },
  infoValue: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  bioCard: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  bioText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: Spacing.sm },
  editBtn: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border },
  editBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  daysSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  daysRow: { flexDirection: 'row', gap: 6 },
  dayChip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  dayActive: { backgroundColor: Colors.gold + '22', borderColor: Colors.gold },
  dayText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  dayActiveText: { color: Colors.gold },
  logoutBtn: { marginHorizontal: Spacing.lg, backgroundColor: Colors.error + '18', borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '44' },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
});
