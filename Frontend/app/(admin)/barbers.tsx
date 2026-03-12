import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BARBERS, SERVICES } from '@/constants/MockData';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';
import StarRating from '@/components/StarRating';

export default function AdminBarbersScreen() {
  const [barbers, setBarbers] = useState(BARBERS);

  function toggleStatus(id: string) {
    Alert.alert('Change Status', 'Toggle this barber\'s status?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => {
        setBarbers(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'available' ? 'off_duty' as const : 'available' as const } : b));
      }},
    ]);
  }

  function addBarber() {
    Alert.alert('Add Barber', 'This would open a form to add a new barber.');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Barbers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addBarber}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }} showsVerticalScrollIndicator={false}>
        {barbers.map(b => (
          <View key={b.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Avatar initials={b.initials} color={b.color} size={52} fontSize={18} />
              <View style={styles.info}>
                <Text style={styles.name}>{b.name}</Text>
                <Text style={styles.spec}>{b.specialization}</Text>
                <StarRating rating={b.rating} reviewCount={b.reviewCount} size={12} />
              </View>
              <View style={styles.cardRight}>
                <StatusBadge status={b.status} small />
                <Text style={styles.exp}>{b.experience} yrs exp</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              {[
                { label: 'Price', value: b.price },
                { label: 'Hours', value: b.workingHours.split('–')[0].trim() + '+' },
                { label: 'Services', value: b.services.length.toString() + ' offered' },
              ].map(s => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>✏️ Edit Profile</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, b.status !== 'off_duty' && styles.deactivateBtn]} onPress={() => toggleStatus(b.id)}>
                <Text style={[styles.toggleText, b.status !== 'off_duty' && styles.deactivateText]}>{b.status === 'off_duty' ? '✓ Activate' : '✕ Deactivate'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  addBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 8, paddingHorizontal: 16 },
  addBtnText: { color: Colors.black, fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  info: { flex: 1, gap: 3 },
  name: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  spec: { color: Colors.textSecondary, fontSize: 13 },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  exp: { color: Colors.textMuted, fontSize: 11 },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { color: Colors.text, fontSize: 11, fontWeight: '700' },
  statLabel: { color: Colors.textMuted, fontSize: 9 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  editBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  editBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  toggleBtn: { flex: 1, backgroundColor: Colors.success + '18', borderRadius: Radius.sm, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: Colors.success },
  deactivateBtn: { backgroundColor: Colors.error + '18', borderColor: Colors.error },
  toggleText: { color: Colors.success, fontSize: 13, fontWeight: '700' },
  deactivateText: { color: Colors.error },
});
