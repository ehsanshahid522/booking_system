import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/admin/dashboard');
        setDashboard(res.data?.data?.dashboard || null);
      } catch (error) {
        console.error('Admin dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  const stats = [
    { label: 'Total customers', value: dashboard?.totalCustomers ?? 0 },
    { label: 'Barbers', value: dashboard?.totalBarbers ?? 0 },
    { label: 'Bookings', value: dashboard?.totalBookings ?? 0 },
    { label: 'Revenue', value: `£${dashboard?.revenue ?? 0}` },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.lg }}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Salon overview</Text>

      <View style={styles.grid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardLarge}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summaryText}>Completed bookings: {dashboard?.completedBookings ?? 0}</Text>
        <Text style={styles.summaryText}>Pending revenue pipeline: £{dashboard?.revenue ?? 0}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  title: { color: Colors.text, fontSize: 28, fontWeight: '800', marginTop: 54 },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 6, marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.md },
  card: { width: '48%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  cardValue: { color: Colors.gold, fontSize: 24, fontWeight: '800' },
  cardLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 8 },
  cardLarge: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  summaryText: { color: Colors.textSecondary, fontSize: 14, marginBottom: 8 },
});
