import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';

interface Booking {
  _id: string;
  customer: { name: string; phone?: string };
  service: { name: string };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  notes?: string;
}

export default function RequestsScreen() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await apiClient.get('/bookings/my');
      const all: Booking[] = res.data?.data?.bookings || [];
      // Only pending bookings (not manual_offline)
      setRequests(all.filter(b => b.status === 'pending'));
    } catch (e) { console.error('Requests fetch error', e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAction = async (id: string, action: 'confirmed' | 'cancelled') => {
    const label = action === 'confirmed' ? 'Accept' : 'Reject';
    Alert.alert(
      `${label} Booking`,
      action === 'confirmed' ? 'Confirm this appointment for the customer?' : 'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: label, style: action === 'cancelled' ? 'destructive' : 'default',
          onPress: async () => {
            setProcessingId(id);
            try {
              await apiClient.put(`/bookings/${id}/status`, { status: action });
              await fetchRequests();
              Alert.alert('Done', action === 'confirmed' ? 'Booking confirmed! Customer will be notified.' : 'Booking rejected.');
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || `Could not ${label.toLowerCase()} booking`);
            } finally { setProcessingId(null); }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Requests</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{requests.length} pending</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRequests(); }} tintColor={Colors.gold} />}
      >
        {requests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySub}>New booking requests from customers will appear here</Text>
          </View>
        ) : (
          requests.map(req => (
            <View key={req._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{req.customer?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.customerName}>{req.customer?.name}</Text>
                  <Text style={styles.service}>{req.service?.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>📅 {req.date}</Text>
                    <Text style={styles.metaText}>🕐 {req.startTime}</Text>
                  </View>
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.amount}>Rs. {req.amount?.toLocaleString()}</Text>
                  <Text style={styles.amountLabel}>Cash</Text>
                </View>
              </View>

              {req.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>💬 "{req.notes}"</Text>
                </View>
              ) : null}

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleAction(req._id, 'cancelled')}
                  disabled={processingId === req._id}
                >
                  {processingId === req._id
                    ? <ActivityIndicator color={Colors.error} size="small" />
                    : <Text style={styles.rejectText}>✕ Reject</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAction(req._id, 'confirmed')}
                  disabled={processingId === req._id}
                >
                  {processingId === req._id
                    ? <ActivityIndicator color={Colors.background} size="small" />
                    : <Text style={styles.acceptText}>✓ Accept</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800', flex: 1 },
  countBadge: { backgroundColor: Colors.warning + '22', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: Colors.warning + '66' },
  countText: { color: Colors.warning, fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  emptySub: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center' },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  avatarFallback: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.gold + '33', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.gold + '66' },
  avatarText: { color: Colors.gold, fontSize: 18, fontWeight: '800' },
  cardInfo: { flex: 1, gap: 3 },
  customerName: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  service: { color: Colors.textSecondary, fontSize: 14 },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: 2 },
  metaText: { color: Colors.textMuted, fontSize: 12 },
  amountBox: { alignItems: 'flex-end' },
  amount: { color: Colors.gold, fontSize: 16, fontWeight: '800' },
  amountLabel: { color: Colors.textMuted, fontSize: 11 },
  notesBox: { backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.sm },
  notesText: { color: Colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
  buttons: { flexDirection: 'row', gap: Spacing.sm },
  rejectBtn: { flex: 1, backgroundColor: Colors.error + '18', borderRadius: Radius.sm, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.error },
  rejectText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
  acceptBtn: { flex: 2, backgroundColor: Colors.gold, borderRadius: Radius.sm, paddingVertical: 12, alignItems: 'center' },
  acceptText: { color: Colors.background, fontWeight: '800', fontSize: 14 },
});
