import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { SERVICES, BARBERS, TIME_SLOTS, BOOKED_SLOTS } from '@/constants/MockData';
import Avatar from '@/components/Avatar';

const STEPS = ['Service', 'Barber', 'Date', 'Confirm'];

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
  const [selectedBarber, setSelectedBarber] = useState(params.barberId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const days = getNext7Days();
  const svc = SERVICES.find(s => s.id === selectedService);
  const barber = BARBERS.find(b => b.id === selectedBarber);

  function canNext() {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedBarber;
    if (step === 2) return !!selectedDate && !!selectedSlot;
    return true;
  }

  function handleConfirm() {
    Alert.alert(
      '✅ Booking Confirmed!',
      `Your ${svc?.name} with ${barber?.name} on ${selectedDate} at ${selectedSlot} has been booked!`,
      [{ text: 'View Bookings', onPress: () => router.replace('/(customer)/my-bookings' as any) }]
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step > 0 ? setStep(s => s - 1) : router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Booking</Text>
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
            <Text style={styles.stepTitle}>Choose a Service</Text>
            {SERVICES.map(svc => (
              <TouchableOpacity
                key={svc.id}
                style={[styles.optionCard, selectedService === svc.id && styles.optionCardActive]}
                onPress={() => setSelectedService(svc.id)}
              >
                <Text style={styles.optionIcon}>{svc.icon}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, selectedService === svc.id && { color: Colors.gold }]}>{svc.name}</Text>
                  <Text style={styles.optionSub}>{svc.category} · {svc.duration} min</Text>
                </View>
                <Text style={[styles.optionPrice, selectedService === svc.id && { color: Colors.goldLight }]}>Rs. {svc.price.toLocaleString()}</Text>
                {selectedService === svc.id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1: Select Barber */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose a Barber</Text>
            {BARBERS.map(b => (
              <TouchableOpacity
                key={b.id}
                style={[styles.barberOption, selectedBarber === b.id && styles.optionCardActive, b.status === 'off_duty' && styles.disabledOption]}
                onPress={() => b.status !== 'off_duty' && setSelectedBarber(b.id)}
              >
                <Avatar initials={b.initials} color={b.color} size={44} fontSize={16} />
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionName, selectedBarber === b.id && { color: Colors.gold }]}>{b.name}</Text>
                  <Text style={styles.optionSub}>{b.specialization} · ⭐ {b.rating}</Text>
                </View>
                <View style={styles.statusChip}>
                  <Text style={[styles.statusText, b.status === 'available' && { color: Colors.success }, b.status === 'busy' && { color: Colors.warning }, b.status === 'off_duty' && { color: Colors.textMuted }]}>
                    {b.status === 'available' ? '● Online' : b.status === 'busy' ? '● Busy' : '● Off'}
                  </Text>
                </View>
                {selectedBarber === b.id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, paddingBottom: Spacing.md }}>
              {days.map((d, i) => {
                const key = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en', { weekday: 'short' });
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
              {TIME_SLOTS.map(slot => {
                const isBooked = BOOKED_SLOTS.includes(slot);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotChip, selectedSlot === slot && styles.slotActive, isBooked && styles.slotBooked]}
                    onPress={() => !isBooked && setSelectedSlot(slot)}
                    disabled={isBooked}
                  >
                    <Text style={[styles.slotText, selectedSlot === slot && { color: Colors.black }, isBooked && { color: Colors.textMuted }]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              {[
                { label: '✂️ Service', value: svc?.name || '-' },
                { label: '💈 Barber', value: barber?.name || '-' },
                { label: '📅 Date', value: selectedDate ? new Date(selectedDate).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' }) : '-' },
                { label: '🕐 Time', value: selectedSlot || '-' },
                { label: '⏱ Duration', value: `${svc?.duration} min` },
                { label: '💰 Price', value: `Rs. ${svc?.price.toLocaleString()}` },
              ].map(item => (
                <View key={item.label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.stepTitle}>Payment Method</Text>
            {['Pay Online', 'Cash on Visit'].map(m => (
              <TouchableOpacity key={m} style={styles.payOption}>
                <Text style={styles.payIcon}>{m === 'Pay Online' ? '💳' : '💵'}</Text>
                <Text style={styles.payText}>{m}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.noteLabel}>Additional Notes (Optional)</Text>
            <View style={styles.noteInput}>
              <Text style={{ color: notes ? Colors.text : Colors.textMuted }}>{notes || 'Any special instructions for your barber...'}</Text>
            </View>
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
          <Text style={styles.nextBtnText}>{step < STEPS.length - 1 ? 'Continue →' : '✅ Confirm Booking'}</Text>
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
  optionPrice: { color: Colors.gold, fontWeight: '700', fontSize: 14 },
  checkIcon: { color: Colors.gold, fontSize: 18, fontWeight: '700', marginLeft: 4 },
  barberOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border },
  disabledOption: { opacity: 0.5 },
  statusChip: {},
  statusText: { fontSize: 11, fontWeight: '600' },
  dateCard: { width: 58, height: 72, borderRadius: Radius.sm, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', gap: 2 },
  dateCardActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dayName: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  dayNum: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  todayLabel: { color: Colors.textMuted, fontSize: 9 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.sm, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  slotActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  slotBooked: { opacity: 0.35, borderColor: Colors.error },
  slotText: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  summaryCard: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: 10, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: Colors.textSecondary, fontSize: 14 },
  summaryValue: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  payIcon: { fontSize: 24 },
  payText: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  noteLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: Spacing.md, marginBottom: Spacing.sm },
  noteInput: { backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, minHeight: 80 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, padding: Spacing.lg, paddingBottom: 30 },
  nextBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: Colors.black, fontSize: 15, fontWeight: '800' },
});
