import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { CUSTOMERS_LIST } from '@/constants/MockData';
import Avatar from '@/components/Avatar';

export default function CustomersScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <Text style={styles.count}>{CUSTOMERS_LIST.length} registered</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }} showsVerticalScrollIndicator={false}>
        {CUSTOMERS_LIST.map(c => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Avatar initials={c.initials} color={c.color} size={48} fontSize={17} />
              <View style={styles.info}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.email}>{c.email}</Text>
                <Text style={styles.phone}>{c.phone}</Text>
              </View>
            </View>
            <View style={styles.stats}>
              {[
                { label: 'Total Bookings', value: c.totalBookings.toString() },
                { label: 'Total Spent', value: `Rs. ${c.totalSpent.toLocaleString()}` },
                { label: 'Last Visit', value: c.lastVisit },
                { label: 'Fav Barber', value: c.favoriteBarber.split(' ')[0] },
              ].map(s => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
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
  count: { color: Colors.textSecondary, fontSize: 13 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  info: { flex: 1, gap: 2 },
  name: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  email: { color: Colors.textSecondary, fontSize: 13 },
  phone: { color: Colors.textMuted, fontSize: 12 },
  stats: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { color: Colors.gold, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  statLabel: { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
});
