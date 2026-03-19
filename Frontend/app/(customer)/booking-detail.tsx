import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = useCallback(async () => {
    try {
      // In this API, we get all and filter or have a specific route
      const res = await apiClient.get('/bookings/my');
      const found = res.data?.data?.bookings?.find((b: any) => b._id === bookingId);
      if (found) {
        setBooking(found);
      } else {
        Alert.alert('Error', 'Booking not found');
        router.back();
      }
    } catch (e) {
      console.error('Fetch booking detail error:', e);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId, fetchBooking]);

  function handleCancel() {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { 
        text: 'Cancel Booking', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await apiClient.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
            Alert.alert('Cancelled', 'Your booking has been cancelled.');
            router.replace('/(customer)/my-bookings' as any);
          } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Could not cancel booking');
          }
        } 
      },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (!booking) return null;

  const formattedDate = new Date(booking.date).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Booking Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.lg }}>
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <Text style={styles.bookingId}># {booking._id.slice(-6).toUpperCase()}</Text>
          <StatusBadge status={booking.status} />
        </View>

        {/* Barber */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Barber</Text>
          <View style={styles.barberRow}>
            <Avatar initials={booking.barber?.name?.charAt(0)} color={Colors.gold} size={52} fontSize={18} />
            <View>
              <Text style={styles.barberName}>{booking.barber?.name}</Text>
              <Text style={styles.barberService}>{booking.service?.name}</Text>
            </View>
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Appointment Details</Text>
          {[
            { icon: '📅', label: 'Date', value: formattedDate },
            { icon: '🕐', label: 'Time', value: `${booking.startTime} – ${booking.endTime}` },
            { icon: '✂️', label: 'Service', value: booking.service?.name },
            { icon: '💬', label: 'Notes', value: booking.notes || 'No special instructions' },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{item.icon}</Text>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Payment</Text>
          {[
            { label: 'Amount', value: `Rs. ${booking.amount?.toLocaleString()}` },
            { label: 'Method', value: 'Cash at Shop' },
            { label: 'Status', value: booking.status === 'completed' ? 'Paid' : 'Unpaid' },
          ].map(item => (
            <View key={item.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={[styles.detailValue, item.label === 'Amount' && { color: Colors.gold }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push({ pathname: '/(customer)/chat', params: { otherUserId: booking.barber?._id } } as any)}>
              <Text style={styles.chatBtnText}>💬 Message Barber</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  title: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  statusBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  bookingId: { color: Colors.textMuted, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  cardLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  barberRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  barberName: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  barberService: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailIcon: { fontSize: 16, width: 22 },
  detailLabel: { color: Colors.textSecondary, fontSize: 14, flex: 1 },
  detailValue: { color: Colors.text, fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1 },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  chatBtn: { flex: 2, backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 13, alignItems: 'center' },
  chatBtnText: { color: Colors.black, fontWeight: '800', fontSize: 14 },
  cancelBtn: { flex: 1, borderRadius: Radius.full, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '88', backgroundColor: Colors.error + '18' },
  cancelBtnText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
});
