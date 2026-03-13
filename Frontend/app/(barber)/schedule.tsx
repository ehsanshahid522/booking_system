import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';

interface Booking {
  _id: string;
  customer: { name: string; phone?: string };
  service: { name: string; duration: number };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  amount: number;
  notes?: string;
}

interface BarberService {
  service: { _id: string; name: string; duration: number };
  customPrice: number;
}

// Generate hourly slots from a working hours string like "09:00 AM - 06:00 PM"
function generateSlots(workingHours: string, date: string): string[] {
  // Default: 9 AM to 6 PM
  const slots: string[] = [];
  try {
    const [startStr, endStr] = workingHours.split(' - ');
    const to24 = (s: string) => {
      const [time, period] = s.trim().split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h;
    };
    const startH = to24(startStr);
    const endH = to24(endStr);
    for (let h = startH; h < endH; h++) {
      const period = h < 12 ? 'AM' : 'PM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      slots.push(`${String(hour).padStart(2, '0')}:00 ${period}`);
    }
  } catch {
    // fallback
    for (let h = 9; h < 18; h++) {
      const period = h < 12 ? 'AM' : 'PM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      slots.push(`${String(hour).padStart(2, '0')}:00 ${period}`);
    }
  }
  return slots;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleScreen() {
  const { user } = useAuth();
  const todayDate = new Date();
  const [selectedDateOffset, setSelectedDateOffset] = useState(0); // 0 = today, 1 = tomorrow, etc.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myServices, setMyServices] = useState<BarberService[]>([]);
  const [workingHours, setWorkingHours] = useState('09:00 AM - 06:00 PM');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Manual booking modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualSlot, setManualSlot] = useState('');
  const [manualClient, setManualClient] = useState('');
  const [manualService, setManualService] = useState<BarberService | null>(null);
  const [savingManual, setSavingManual] = useState(false);

  const getDateStr = (offset: number) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        apiClient.get('/bookings/my'),
        apiClient.get(`/barbers/${user?._id}`),
      ]);
      const bData = bookingsRes.data?.data?.bookings || [];
      setBookings(bData);
      const barber = profileRes.data?.data?.barber;
      if (barber?.workingHours) setWorkingHours(barber.workingHours);
      if (barber?.services) setMyServices(barber.services);
    } catch (e) { console.error('Schedule fetch:', e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectedDate = getDateStr(selectedDateOffset);
  const dayBookings = bookings.filter(b => b.date === selectedDate);
  const slots = generateSlots(workingHours, selectedDate);

  const getSlotBooking = (slot: string) => dayBookings.find(b => b.startTime === slot);

  const handleMarkComplete = async (id: string) => {
    try {
      await apiClient.put(`/bookings/${id}/status`, { status: 'completed' });
      fetchData();
    } catch { Alert.alert('Error', 'Could not mark as complete'); }
  };

  const openManualModal = (slot: string) => {
    setManualSlot(slot);
    setManualClient('');
    setManualService(myServices[0] || null);
    setShowManualModal(true);
  };

  const handleManualBook = async () => {
    if (!manualClient || !manualService) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setSavingManual(true);
    try {
      await apiClient.post('/bookings', {
        barberId: user?._id,
        serviceId: manualService.service._id,
        date: selectedDate,
        startTime: manualSlot,
        endTime: manualSlot, // simplified; backend might calculate
        notes: `Offline: ${manualClient}`,
        status: 'manual_offline',
      });
      Alert.alert('Success', 'Slot blocked successfully!');
      setShowManualModal(false);
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to block slot');
    } finally { setSavingManual(false); }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Schedule 📅</Text>
      </View>

      {/* Day Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(todayDate);
          d.setDate(d.getDate() + i);
          const isSelected = i === selectedDateOffset;
          return (
            <TouchableOpacity key={i} style={[styles.dayChip, isSelected && styles.dayChipActive]} onPress={() => setSelectedDateOffset(i)}>
              <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>{WEEKDAYS[d.getDay()]}</Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>{d.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Summary Bar */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Total', value: dayBookings.length, color: Colors.text },
          { label: 'Done', value: dayBookings.filter(b => b.status === 'completed').length, color: Colors.success },
          { label: 'Remaining', value: dayBookings.filter(b => b.status === 'confirmed').length, color: Colors.warning },
          { label: 'Earnings', value: `Rs.${dayBookings.filter(b=>b.status==='completed').reduce((s,b)=>s+b.amount,0).toLocaleString()}`, color: Colors.gold },
        ].map(s => (
          <View key={s.label} style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Hourly Slots */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.gold} />}
      >
        {slots.map(slot => {
          const booking = getSlotBooking(slot);
          const isBooked = !!booking;
          const isCompleted = booking?.status === 'completed';
          const isOffline = booking?.status === 'manual_offline';

          return (
            <View key={slot} style={styles.slotRow}>
              <Text style={[styles.slotTime, isBooked && styles.slotTimeBooked]}>{slot}</Text>
              <View style={[styles.slotCard, isBooked && styles.slotCardBooked, isCompleted && styles.slotCardDone, isOffline && styles.slotCardOffline]}>
                {isBooked ? (
                  <>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.slotClientName}>
                        {isOffline ? `🔒 ${booking.notes?.replace('Offline: ', '')}` : `👤 ${booking.customer?.name}`}
                      </Text>
                      <Text style={styles.slotServiceName}>{booking.service?.name}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={styles.slotAmount}>Rs. {booking.amount.toLocaleString()}</Text>
                      {booking.status === 'confirmed' && (
                        <TouchableOpacity style={styles.completeBtn} onPress={() => handleMarkComplete(booking._id)}>
                          <Text style={styles.completeBtnText}>✓ Done</Text>
                        </TouchableOpacity>
                      )}
                      {isCompleted && <Text style={styles.completedLabel}>Completed ✅</Text>}
                    </View>
                  </>
                ) : (
                  <TouchableOpacity style={styles.emptySlotContent} onPress={() => openManualModal(slot)}>
                    <Text style={styles.emptySlotText}>Available — Tap to block</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Manual Booking Modal */}
      <Modal visible={showManualModal} animationType="slide" transparent onRequestClose={() => setShowManualModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Block Slot: {manualSlot}</Text>
              <TouchableOpacity onPress={() => setShowManualModal(false)}>
                <Text style={{ color: Colors.textMuted, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Walk-in Client Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kamran Khan"
              placeholderTextColor={Colors.textMuted}
              value={manualClient}
              onChangeText={setManualClient}
            />
            <Text style={styles.inputLabel}>Service</Text>
            <ScrollView style={{ maxHeight: 150 }}>
              {myServices.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.serviceOption, manualService?.service._id === s.service._id && styles.serviceOptionActive]}
                  onPress={() => setManualService(s)}
                >
                  <Text style={styles.serviceOptionText}>{s.service?.name}</Text>
                  <Text style={styles.serviceOptionPrice}>Rs. {s.customPrice}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.saveBtn} onPress={handleManualBook} disabled={savingManual}>
              {savingManual ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.saveBtnText}>Block Slot</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.sm },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  dayScroll: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 10 },
  dayChip: { backgroundColor: Colors.card, borderRadius: Radius.md, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, minWidth: 52 },
  dayChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dayName: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  dayNameActive: { color: Colors.background },
  dayNum: { color: Colors.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  dayNumActive: { color: Colors.background },
  summaryRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginVertical: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: 14, fontWeight: '800' },
  summaryLabel: { color: Colors.textMuted, fontSize: 10 },
  slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: Spacing.sm },
  slotTime: { width: 60, color: Colors.textMuted, fontSize: 12, fontWeight: '600', textAlign: 'right' },
  slotTimeBooked: { color: Colors.gold },
  slotCard: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card, minHeight: 52 },
  slotCardBooked: { borderColor: Colors.gold + '88', backgroundColor: Colors.gold + '11' },
  slotCardDone: { borderColor: Colors.success + '66', backgroundColor: Colors.success + '0A', opacity: 0.7 },
  slotCardOffline: { borderColor: Colors.warning + '88', backgroundColor: Colors.warning + '11' },
  slotClientName: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  slotServiceName: { color: Colors.textSecondary, fontSize: 11 },
  slotAmount: { color: Colors.gold, fontWeight: '700', fontSize: 12 },
  completeBtn: { backgroundColor: Colors.success + '22', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8, borderWidth: 1, borderColor: Colors.success },
  completeBtnText: { color: Colors.success, fontSize: 11, fontWeight: '700' },
  completedLabel: { color: Colors.success, fontSize: 10, fontWeight: '700' },
  emptySlotContent: { flex: 1, alignItems: 'center' },
  emptySlotText: { color: Colors.textMuted, fontSize: 12 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  inputLabel: { color: Colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.text, fontSize: 15, marginBottom: Spacing.sm },
  serviceOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  serviceOptionActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
  serviceOptionText: { color: Colors.text, fontWeight: '600' },
  serviceOptionPrice: { color: Colors.gold, fontWeight: '700' },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: Spacing.md },
  saveBtnText: { color: Colors.background, fontWeight: '800', fontSize: 16 },
});
