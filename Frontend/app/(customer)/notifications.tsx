import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { NOTIFICATIONS } from '@/constants/MockData';
import NotificationItem from '@/components/NotificationItem';

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter(n => !n.isRead).length;

  function markAllRead() {
    setNotifs(n => n.map(item => ({ ...item, isRead: true })));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.subtitle}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markBtn} onPress={markAllRead}>
            <Text style={styles.markText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {notifs.map(n => (
          <NotificationItem
            key={n.id}
            {...n}
            onPress={() => setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item))}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: Colors.gold, fontSize: 13, marginTop: 2 },
  markBtn: { backgroundColor: Colors.card, borderRadius: Radius.sm, paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border, marginTop: 4 },
  markText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
});
