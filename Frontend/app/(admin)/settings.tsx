import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';

export default function AdminSettingsScreen() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [shopOpen, setShopOpen] = useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Shop Info */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Shop Information</Text>
        {[
          { icon: '💈', label: 'Shop Name', value: 'BarberPro' },
          { icon: '📍', label: 'Address', value: 'Main Market, Lahore' },
          { icon: '📞', label: 'Phone', value: '+92 42 12345678' },
          { icon: '🕐', label: 'Open Hours', value: '9:00 AM – 9:00 PM' },
          { icon: '📅', label: 'Off Days', value: 'Sunday (Full)' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.settingRow}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>System Controls</Text>
        {[
          { label: 'Push Notifications', value: notifications, setter: setNotifications, desc: 'Send alerts to customers' },
          { label: 'Online Booking', value: onlineBooking, setter: setOnlineBooking, desc: 'Accept bookings via app' },
          { label: 'Auto-Confirm Bookings', value: autoConfirm, setter: setAutoConfirm, desc: 'Skip manual approval' },
          { label: 'Shop Open', value: shopOpen, setter: setShopOpen, desc: 'Toggle shop availability' },
        ].map(item => (
          <View key={item.label} style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>{item.label}</Text>
              <Text style={styles.toggleDesc}>{item.desc}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.setter}
              thumbColor={item.value ? Colors.gold : Colors.textMuted}
              trackColor={{ true: Colors.gold + '44', false: Colors.border }}
            />
          </View>
        ))}
      </View>

      {/* Offer Management */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Offers & Promotions</Text>
        {[
          { icon: '🎉', label: 'Friday Special', detail: '20% off all beard services' },
          { icon: '🌙', label: 'Eid Discount', detail: '30% off all services' },
          { icon: '🎂', label: 'Birthday Offer', detail: 'Free hair wash on birthday' },
        ].map(offer => (
          <View key={offer.label} style={styles.offerRow}>
            <Text style={styles.offerIcon}>{offer.icon}</Text>
            <View style={styles.offerInfo}>
              <Text style={styles.offerLabel}>{offer.label}</Text>
              <Text style={styles.offerDetail}>{offer.detail}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Admin Info */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        {[
          { icon: '🔐', label: 'Change Password' },
          { icon: '📧', label: 'Update Email' },
          { icon: '📊', label: 'Export Reports' },
          { icon: '🗄️', label: 'Backup Data' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.settingRow}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={[styles.settingLabel, { flex: 1 }]}>{item.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>BarberPro Admin v1.0.0</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ])}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  section: { marginHorizontal: Spacing.lg, marginTop: Spacing.md, backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.sm },
  sectionLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', padding: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { fontSize: 18, width: 26 },
  settingLabel: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  settingValue: { flex: 1, color: Colors.textSecondary, fontSize: 13, textAlign: 'right', marginRight: 4 },
  arrow: { color: Colors.textMuted, fontSize: 20 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  toggleInfo: { flex: 1 },
  toggleLabel: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  toggleDesc: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  offerIcon: { fontSize: 22 },
  offerInfo: { flex: 1 },
  offerLabel: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  offerDetail: { color: Colors.textSecondary, fontSize: 12 },
  editBtn: { backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1, borderColor: Colors.border },
  editBtnText: { color: Colors.textSecondary, fontSize: 12 },
  version: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginVertical: Spacing.md },
  logoutBtn: { marginHorizontal: Spacing.lg, backgroundColor: Colors.error + '18', borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '44' },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '700' },
});
