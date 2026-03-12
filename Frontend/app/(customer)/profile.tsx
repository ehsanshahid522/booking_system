import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BOOKINGS, PAYMENTS } from '@/constants/MockData';
import Avatar from '@/components/Avatar';

const MENU_ITEMS = [
  { icon: '📅', label: 'My Bookings', count: 4 },
  { icon: '💳', label: 'Payment History', count: null },
  { icon: '💬', label: 'Messages', count: 1 },
  { icon: '🔔', label: 'Notifications', count: 2 },
  { icon: '⭐', label: 'Loyalty Points', count: null },
  { icon: '❤️', label: 'Favourite Barbers', count: null },
  { icon: '🎁', label: 'Offers & Coupons', count: null },
  { icon: '⚙️', label: 'Settings', count: null },
  { icon: '❓', label: 'Help & Support', count: null },
];

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const totalSpent = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const completedBookings = BOOKINGS.filter(b => b.status === 'completed').length;

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <Avatar initials={user?.initials || 'U'} color={user?.color || Colors.gold} size={88} fontSize={32} />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Text style={{ fontSize: 14 }}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Bookings', value: BOOKINGS.length.toString() },
          { label: 'Completed', value: completedBookings.toString() },
          { label: 'Spent', value: `Rs. ${totalSpent.toLocaleString()}` },
          { label: 'Points', value: '240' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Loyalty Card */}
      <View style={styles.loyaltyCard}>
        <View>
          <Text style={styles.loyaltyTitle}>Gold Member 🏆</Text>
          <Text style={styles.loyaltySub}>240 / 500 points to Platinum</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '48%' }]} />
          </View>
        </View>
        <Text style={styles.loyaltyEmoji}>⭐</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <View style={styles.menuRight}>
              {item.count != null && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.count}</Text>
                </View>
              )}
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <Text style={styles.version}>BarberPro v1.0.0</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: 'center', paddingTop: 56, paddingBottom: Spacing.lg, gap: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatarWrap: { position: 'relative' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.background },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  email: { color: Colors.textSecondary, fontSize: 14 },
  phone: { color: Colors.textMuted, fontSize: 13 },
  editBtn: { backgroundColor: Colors.card, borderRadius: Radius.full, paddingVertical: 8, paddingHorizontal: 24, borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.sm },
  editBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginVertical: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11 },
  loyaltyCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.goldDark + '22', borderRadius: Radius.md, marginHorizontal: Spacing.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold + '55', marginBottom: Spacing.lg },
  loyaltyTitle: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  loyaltySub: { color: Colors.textSecondary, fontSize: 12, marginVertical: 6 },
  progressBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, width: 180 },
  progressFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 3 },
  loyaltyEmoji: { fontSize: 36 },
  menuSection: { backgroundColor: Colors.card, marginHorizontal: Spacing.lg, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuBadge: { backgroundColor: Colors.gold, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1 },
  menuBadgeText: { color: Colors.black, fontSize: 10, fontWeight: '800' },
  menuArrow: { color: Colors.textMuted, fontSize: 20 },
  version: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginBottom: Spacing.sm },
  logoutBtn: { marginHorizontal: Spacing.lg, backgroundColor: Colors.error + '18', borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '44' },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
});
