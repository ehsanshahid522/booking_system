import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import Avatar from '@/components/Avatar';

const MENU_ITEMS = [
  { id: '1', title: 'Payment Methods', subtitle: 'Manage your cards', icon: '💳', route: null },
  { id: '2', title: 'Favorite Barbers', subtitle: 'Barbers you love', icon: '❤️', route: null },
  { id: '3', title: 'Address Book', subtitle: 'Saved locations', icon: '🏠', route: null },
  { id: '4', title: 'Legal & Privacy', subtitle: 'Terms of service', icon: '📄', route: null },
];

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = user?.name?.substring(0, 2).toUpperCase() || 'GU';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar initials={initials} color={Colors.gold} size={80} fontSize={28} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>0</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statVal}>Rs. 0</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => item.route && router.push(item.route as any)}>
            <View style={styles.menuIconBox}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={() => Alert.alert('Logout', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: logout }
        ])}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 64, paddingBottom: 24, gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerInfo: { flex: 1, gap: 2 },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  email: { color: Colors.textSecondary, fontSize: 14, marginBottom: 4 },
  editBtn: { alignSelf: 'flex-start', borderBottomWidth: 1.5, borderBottomColor: Colors.gold },
  editBtnText: { color: Colors.gold, fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', margin: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  statBox: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: 12 },
  statDivider: { width: 1, height: '60%', backgroundColor: Colors.border, alignSelf: 'center' },
  menuSection: { paddingHorizontal: Spacing.lg, marginBottom: 24 },
  sectionTitle: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  menuIcon: { fontSize: 18 },
  menuInfo: { flex: 1 },
  menuTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  menuSubtitle: { color: Colors.textMuted, fontSize: 12 },
  menuArrow: { color: Colors.textMuted, fontSize: 16 },
  logoutBtn: { marginHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: Colors.error + '18', borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.error + '44' },
  logoutIcon: { fontSize: 18 },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: '700' },
});
