import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];
const STEPS = ['Service', 'Date & Time', 'Confirm'];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceId?: string; barberId?: string }>();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(params.serviceId || '');
  const [primaryBarber, setPrimaryBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [barberRes, servicesRes] = await Promise.all([
          apiClient.get(params.barberId ? `/barbers/${params.barberId}` : '/barbers/primary'),
          apiClient.get('/services')
        ]);
        const bRes = barberRes?.data?.data?.barber || barberRes?.data?.data;
        const sRes = servicesRes?.data?.data?.services || servicesRes?.data?.data || [];
        
        setPrimaryBarber(bRes || null);
        setServices(Array.isArray(sRes) ? sRes : []);
        
        // Default to first service if none selected
        if (!params.serviceId && Array.isArray(sRes) && sRes.length > 0) {
          setSelectedService(sRes[0]._id);
        }
      } catch (e: any) {
        console.error('Fetch error:', e);
        Alert.alert('Error', e.response?.data?.message || 'Could not load booking data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.barberId, params.serviceId]);

  const days = getNext7Days();
  const safeServices = Array.isArray(services) ? services : [];
  const svc = safeServices.find(s => s._id === selectedService);

  // Find custom price from salon profile or fallback to standard service price
  const bService = primaryBarber?.services?.find((s: any) => 
    (s.service?._id || s.service) === selectedService
  );
  const realPrice = bService?.customPrice ?? (svc?.price || 25);

  function canNext() {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDate && !!selectedSlot;
    if (step === 2) return !submitting;
    return true;
  }

  async function handleConfirm() {
    if (!svc || !primaryBarber) {
      Alert.alert('Error', 'Salon or service information missing.');
      return;
    }
    try {
      setSubmitting(true);
      await apiClient.post('/bookings', {
        barberId: primaryBarber._id,
        serviceId: svc._id,
        date: selectedDate,
        startTime: selectedSlot,
        endTime: selectedSlot,
        notes
      });
      
      Alert.alert(
        '✅ Booking Confirmed!',
        `Your ${svc.name} at ${primaryBarber.shopName || 'Ehsan Salon'} on ${selectedDate} at ${selectedSlot} is reserved!`,
        [{ text: 'View My Bookings', onPress: () => router.replace('/(customer)/my-bookings' as any) }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Booking Failed', error.response?.data?.message || 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.gold, fontSize: 16, fontWeight: '700' }}>Loading Salon Booking...</Text>
      </View>
    );
  }

  const shopName = primaryBarber?.shopName || 'Ehsan Salon';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep(s => s - 1) : router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Book Appointment</Text>
          <Text style={styles.subtitle}>{shopName}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepsRow}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive, i < step && styles.stepCircleDone]}>
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>{i < step ? '✓' : i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, i < step && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Step 0: Select Service */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Service</Text>
            {safeServices.length === 0 ? <Text style={{ color: Colors.textMuted }}>No services available.</Text> : null}
            {safeServices.map(item => (
              <TouchableOpacity
                key={item._id}
                style={[styles.optionCard, selectedService === item._id && styles.optionCardActive]}
                onPress={() => setSelectedService(item._id)}
              >
                <Text style={styles.optionIcon}>{item.icon || '✨'}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, selectedService === item._id && { color: Colors.gold }]}>{item.name}</Text>
                  <Text style={styles.optionSub}>{item.category} · {item.duration} min</Text>
                </View>
                <Text style={[styles.optionPrice, selectedService === item._id && { color: Colors.goldLight }]}>£{item.price}</Text>
                {selectedService === item._id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1: Select Date & Time */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, paddingBottom: Spacing.md }}>
              {days.map((d, i) => {
                const key = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
                const dayNum = d.getDate();
                return (
                  <TouchableOpacity key={key} style={[styles.dateCard, selectedDate === key && styles.dateCardActive]} onPress={() => setSelectedDate(key)}>
                    <Text style={[styles.dayName, selectedDate === key && { color: Colors.black }]}>{dayName}</Text>
                    <Text style={[styles.dayNum, selectedDate === key && { color: Colors.black }]}>{dayNum}</Text>
                    {i === 0 && <Text style={[styles.todayLabel, selectedDate === key && { color: Colors.black + '99' }]}>Today</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.stepTitle}>Select Time Slot</Text>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotChip, selectedSlot === slot && styles.slotActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text style={[styles.slotText, selectedSlot === slot && { color: Colors.black }]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              {[
                { label: '💈 Salon', value: shopName },
                { label: '📍 Location', value: primaryBarber?.shopLocation || 'Central London, UK' },
                { label: '✂️ Service', value: svc?.name || '-' },
                { label: '📅 Date', value: selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '-' },
                { label: '🕐 Time', value: selectedSlot || '-' },
                { label: '⏱ Duration', value: `${svc?.duration || 30} min` },
                { label: '💰 Total Amount', value: `£${realPrice}` },
              ].map(item => (
                <View key={item.label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.stepTitle}>Payment Preference</Text>
            {['Pay at Salon (Cash / Card)', 'Online Pre-payment'].map((m, idx) => (
              <View key={m} style={[styles.payOption, idx === 0 && { borderColor: Colors.gold }]}>
                <Text style={styles.payIcon}>{idx === 0 ? '💵' : '💳'}</Text>
                <Text style={styles.payText}>{m}</Text>
                {idx === 0 && <Text style={{ color: Colors.gold, fontWeight: '800' }}>✓ Selected</Text>}
              </View>
            ))}

            <Text style={styles.stepTitle}>Special Instructions</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any requests for your barber? (optional)"
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={300}
            />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
          onPress={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleConfirm()}
          disabled={!canNext()}
        >
          <Text style={styles.nextBtnText}>{submitting ? 'Booking...' : (step < STEPS.length - 1 ? 'Continue →' : '✅ Confirm Booking (£' + realPrice + ')')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  title: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  subtitle: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
  stepsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.card, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '22' },
  stepCircleDone: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  stepNum: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  stepNumActive: { color: Colors.gold },
  stepLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  stepLabelActive: { color: Colors.gold },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 16 },
  stepLineDone: { backgroundColor: Colors.gold },
  body: { flex: 1 },
  stepContent: { padding: Spacing.lg },
  stepTitle: { color: Colors.text, fontSize: 18, fontWeight: '800', marginBottom: Spacing.md, marginTop: Spacing.sm },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border },
  optionCardActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '10' },
  optionIcon: { fontSize: 26 },
  optionInfo: { flex: 1 },
  optionName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  optionSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  optionPrice: { color: Colors.gold, fontWeight: '800', fontSize: 16 },
  checkIcon: { color: Colors.gold, fontSize: 18, fontWeight: '700', marginLeft: 4 },
  dateCard: { width: 62, height: 74, borderRadius: Radius.sm, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', gap: 2 },
  dateCardActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dayName: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  dayNum: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  todayLabel: { color: Colors.textMuted, fontSize: 9 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  slotActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  slotText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  summaryCard: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: 10, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: Colors.textSecondary, fontSize: 14 },
  summaryValue: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  payIcon: { fontSize: 22 },
  payText: { color: Colors.text, fontSize: 14, fontWeight: '600', flex: 1 },
  notesInput: { minHeight: 84, backgroundColor: Colors.card, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: Spacing.md, textAlignVertical: 'top', fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, padding: Spacing.lg, paddingBottom: 30 },
  nextBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: Colors.black, fontSize: 15, fontWeight: '800' },
});
