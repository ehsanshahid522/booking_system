import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { BOOKING_REQUESTS } from '@/constants/MockData';
import Avatar from '@/components/Avatar';

export default function RequestsScreen() {
  const [requests, setRequests] = useState(BOOKING_REQUESTS);

  function handle(id: string, action: 'accept' | 'reject') {
    Alert.alert(
      action === 'accept' ? 'Accept Booking' : 'Reject Booking',
      action === 'accept' ? 'Confirm this appointment?' : 'Are you sure you want to reject?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: action === 'accept' ? 'Accept' : 'Reject', onPress: () => setRequests(prev => prev.filter(r => r.id !== id)) },
      ]
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

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }} showsVerticalScrollIndicator={false}>
        {requests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySub}>New booking requests will appear here</Text>
          </View>
        ) : requests.map(req => (
          <View key={req.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Avatar initials={req.customerInitials} color={req.customerColor} size={48} fontSize={17} />
              <View style={styles.cardInfo}>
                <Text style={styles.customerName}>{req.customerName}</Text>
                <Text style={styles.service}>{req.service}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>📅 {req.date}</Text>
                  <Text style={styles.metaText}>🕐 {req.time}</Text>
                </View>
              </View>
              <View style={styles.amountBox}>
                <Text style={styles.amount}>Rs. {req.amount.toLocaleString()}</Text>
                <Text style={styles.amountLabel}>Cash/Online</Text>
              </View>
            </View>

            {req.notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>💬 "{req.notes}"</Text>
              </View>
            ) : null}

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handle(req.id, 'reject')}>
                <Text style={styles.rejectText}>✕ Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => handle(req.id, 'accept')}>
                <Text style={styles.acceptText}>✓ Accept</Text>
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
  acceptText: { color: Colors.black, fontWeight: '800', fontSize: 14 },
});
