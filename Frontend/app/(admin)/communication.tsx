import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const TEMPLATES = [
  { id: 't1', label: 'Booking Confirmed', msg: 'Your booking has been confirmed! See you soon. 💈', icon: '✅' },
  { id: 't2', label: 'Reminder', msg: 'Reminder: Your appointment is tomorrow. Please be on time! ⏰', icon: '🔔' },
  { id: 't3', label: 'Friday Special', msg: 'Friday Special Offer! Get 20% off on all beard services today only! 🎉', icon: '🎉' },
  { id: 't4', label: 'Eid Discount', msg: 'Eid Mubarak! Enjoy 30% off on all services this Eid. Book now! 🌙', icon: '🌙' },
  { id: 't5', label: 'New Barber', msg: 'We are excited to announce our new barber! Book an appointment now. 💈', icon: '💈' },
  { id: 't6', label: 'Shop Closed', msg: 'We will be closed tomorrow due to a holiday. We apologize for the inconvenience. 🙏', icon: '🚫' },
];

const SENT_MSGS = [
  { id: 'm1', msg: 'Friday Special Offer! Get 20% off on all beard services today only! 🎉', to: 'All Customers', time: '2 hours ago', count: '187 recipients' },
  { id: 'm2', msg: 'Reminder: Your appointment is tomorrow. Please be on time! ⏰', to: 'Upcoming Bookings', time: 'Yesterday', count: '12 recipients' },
];

export default function CommunicationScreen() {
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'customers' | 'barbers' | 'all'>('customers');

  function sendBroadcast() {
    if (!message.trim()) { Alert.alert('Empty Message', 'Please write a message to broadcast.'); return; }
    Alert.alert('✅ Broadcast Sent!', `Your message has been sent to all ${audience}.`);
    setMessage('');
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Communication</Text>
        <Text style={styles.subtitle}>Broadcast messages to your users</Text>
      </View>

      {/* Compose */}
      <View style={styles.composeCard}>
        <Text style={styles.sectionLabel}>Send To</Text>
        <View style={styles.audienceRow}>
          {(['customers', 'barbers', 'all'] as const).map(a => (
            <TouchableOpacity key={a} style={[styles.audienceBtn, audience === a && styles.audienceBtnActive]} onPress={() => setAudience(a)}>
              <Text style={[styles.audienceBtnText, audience === a && styles.audienceBtnTextActive]}>
                {a === 'customers' ? '👥 Customers' : a === 'barbers' ? '✂️ Barbers' : '📢 Everyone'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Message</Text>
        <TextInput
          style={styles.messageBox}
          placeholder="Type your broadcast message..."
          placeholderTextColor={Colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendBroadcast}>
          <Text style={styles.sendBtnText}>📢 Send Broadcast</Text>
        </TouchableOpacity>
      </View>

      {/* Templates */}
      <Text style={styles.sectionTitle}>Quick Templates</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md }}>
        {TEMPLATES.map(t => (
          <TouchableOpacity key={t.id} style={styles.templateCard} onPress={() => setMessage(t.msg)}>
            <Text style={styles.templateIcon}>{t.icon}</Text>
            <Text style={styles.templateLabel}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sent History */}
      <Text style={styles.sectionTitle}>Sent Messages</Text>
      {SENT_MSGS.map(m => (
        <View key={m.id} style={styles.sentCard}>
          <View style={styles.sentHeader}>
            <Text style={styles.sentTo}>📢 {m.to}</Text>
            <Text style={styles.sentTime}>{m.time}</Text>
          </View>
          <Text style={styles.sentMsg} numberOfLines={2}>{m.msg}</Text>
          <Text style={styles.sentCount}>{m.count}</Text>
        </View>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  composeCard: { margin: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  sectionLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: Spacing.sm },
  audienceRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  audienceBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  audienceBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
  audienceBtnText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  audienceBtnTextActive: { color: Colors.gold },
  messageBox: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: Spacing.md, fontSize: 14, minHeight: 100, marginBottom: Spacing.md, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 13, alignItems: 'center' },
  sendBtnText: { color: Colors.black, fontWeight: '800', fontSize: 14 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  templateCard: { width: 90, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border },
  templateIcon: { fontSize: 26 },
  templateLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  sentCard: { backgroundColor: Colors.card, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: 4 },
  sentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  sentTo: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  sentTime: { color: Colors.textMuted, fontSize: 11 },
  sentMsg: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  sentCount: { color: Colors.textMuted, fontSize: 11 },
});
