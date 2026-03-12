import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = [
  [1,2,3,4,5,6,7],
  [8,9,10,11,12,13,14],
  [15,16,17,18,19,20,21],
  [22,23,24,25,26,27,28],
  [29,30,31,null,null,null,null],
];

const BLOCKED_DAYS = [16, 17, 24];
const BREAK_DAYS = [12];

const BLOCK_TYPES = [
  { label: 'Working', color: Colors.gold, key: 'working' },
  { label: 'Break', color: Colors.warning, key: 'break' },
  { label: 'Day Off', color: Colors.error, key: 'off' },
  { label: 'Available', color: Colors.success, key: 'available' },
];

export default function CalendarScreen() {
  const [blockedDays, setBlockedDays] = useState(BLOCKED_DAYS);
  const today = new Date().getDate();

  function handleDayPress(day: number | null) {
    if (!day) return;
    if (blockedDays.includes(day)) {
      Alert.alert('Remove Block', `Remove blocked day ${day}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => setBlockedDays(prev => prev.filter(d => d !== day)) },
      ]);
    } else {
      Alert.alert('Block Day', `Block day ${day} as unavailable?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Block', onPress: () => setBlockedDays(prev => [...prev, day]) },
      ]);
    }
  }

  function getDayStyle(day: number | null) {
    if (!day) return {};
    if (day === today) return styles.today;
    if (blockedDays.includes(day)) return styles.blocked;
    if (BREAK_DAYS.includes(day)) return styles.breakDay;
    return {};
  }

  function getDayTextStyle(day: number | null) {
    if (!day) return {};
    if (day === today) return styles.todayText;
    if (blockedDays.includes(day)) return styles.blockedText;
    if (BREAK_DAYS.includes(day)) return styles.breakText;
    return {};
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Availability Calendar</Text>
        <Text style={styles.subtitle}>March 2026</Text>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        {BLOCK_TYPES.map(t => (
          <View key={t.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: t.color }]} />
            <Text style={styles.legendText}>{t.label}</Text>
          </View>
        ))}
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {/* Day names */}
        <View style={styles.calRow}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayName}>{d}</Text>
          ))}
        </View>
        {/* Dates */}
        {WEEKS.map((week, wi) => (
          <View key={wi} style={styles.calRow}>
            {week.map((day, di) => (
              <TouchableOpacity
                key={`${wi}-${di}`}
                style={[styles.calCell, getDayStyle(day)]}
                onPress={() => handleDayPress(day)}
                disabled={!day}
              >
                {day && <Text style={[styles.calDate, getDayTextStyle(day)]}>{day}</Text>}
                {day === today && <View style={styles.todayDot} />}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Working Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Working Hours</Text>
        <View style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>Start Time</Text>
            <TouchableOpacity style={styles.timePicker}>
              <Text style={styles.timeValue}>10:00 AM</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hoursDivider} />
          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>End Time</Text>
            <TouchableOpacity style={styles.timePicker}>
              <Text style={styles.timeValue}>8:00 PM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Break */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Break Time</Text>
        <View style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>Break Start</Text>
            <TouchableOpacity style={styles.timePicker}>
              <Text style={styles.timeValue}>2:00 PM</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hoursDivider} />
          <View style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>Break End</Text>
            <TouchableOpacity style={styles.timePicker}>
              <Text style={styles.timeValue}>3:00 PM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: Colors.textSecondary, fontSize: 11 },
  calendar: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  calRow: { flexDirection: 'row' },
  dayName: { flex: 1, textAlign: 'center', color: Colors.textSecondary, fontSize: 11, fontWeight: '700', paddingVertical: 6 },
  calCell: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 6, margin: 2 },
  calDate: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  today: { backgroundColor: Colors.gold },
  todayText: { color: Colors.black, fontWeight: '800' },
  todayDot: {},
  blocked: { backgroundColor: Colors.error + '33', borderWidth: 1, borderColor: Colors.error + '66' },
  blockedText: { color: Colors.error },
  breakDay: { backgroundColor: Colors.warning + '33' },
  breakText: { color: Colors.warning },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: Spacing.sm },
  hoursCard: { backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  hoursRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  hoursLabel: { color: Colors.textSecondary, fontSize: 14 },
  timePicker: { backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 7, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.gold + '66' },
  timeValue: { color: Colors.gold, fontSize: 14, fontWeight: '700' },
  hoursDivider: { height: 1, backgroundColor: Colors.border },
  saveBtn: { marginHorizontal: Spacing.lg, backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.sm },
  saveBtnText: { color: Colors.black, fontWeight: '800', fontSize: 15 },
});
