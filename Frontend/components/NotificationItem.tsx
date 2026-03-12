import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

interface NotificationItemProps {
  title: string;
  body: string;
  time: string;
  type: string;
  isRead: boolean;
  onPress?: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  booking: '📅',
  reminder: '⏰',
  promo: '🎉',
  review: '⭐',
  system: '💈',
  message: '💬',
  payment: '💳',
};

export default function NotificationItem({ title, body, time, type, isRead, onPress }: NotificationItemProps) {
  const icon = TYPE_ICONS[type] || '🔔';
  return (
    <TouchableOpacity style={[styles.item, !isRead && styles.unread]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
        {!isRead && <View style={styles.dot} />}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body} numberOfLines={2}>{body}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  unread: { borderColor: Colors.gold + '55', backgroundColor: Colors.gold + '0A' },
  iconWrap: { position: 'relative', width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  icon: { fontSize: 20 },
  dot: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold, borderWidth: 2, borderColor: Colors.card },
  content: { flex: 1, gap: 3 },
  title: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  body: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  time: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
});
