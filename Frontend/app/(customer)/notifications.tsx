import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import NotificationItem from '@/components/NotificationItem';
import apiClient from '@/api/client';

interface NotificationItemData {
  _id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

function relativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState<NotificationItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifs(res.data?.data?.notifications || []);
    } catch (error: any) {
      console.error('Notifications fetch error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  async function markAllRead() {
    try {
      await apiClient.put('/notifications/read-all');
      setNotifs(prev => prev.map(item => ({ ...item, isRead: true })));
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Could not mark notifications as read');
    }
  }

  async function handleNotificationPress(id: string) {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(item => item._id === id ? { ...item, isRead: true } : item));
    } catch (error: any) {
      console.error('Mark notification read error:', error);
    }
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

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {notifs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            notifs.map(n => (
              <NotificationItem
                key={n._id}
                title={n.title}
                body={n.body}
                time={relativeTime(n.createdAt)}
                type={n.type}
                isRead={n.isRead}
                onPress={() => handleNotificationPress(n._id)}
              />
            ))
          )}
        </ScrollView>
      )}
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
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 42, marginBottom: Spacing.sm },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
