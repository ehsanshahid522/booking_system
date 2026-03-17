import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, FlatList, TextInput, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import apiClient from '@/api/client';

interface ServiceOption { _id: string; name: string; price: number; duration: number; icon: string; category: string; }
interface BarberService { service: ServiceOption; customPrice: number; isActive: boolean; _id: string; }
interface Booking { _id: string; customer: { name: string }; service: { name: string }; date: string; startTime: string; status: string; amount: number; }

export default function BarberDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myServices, setMyServices] = useState<BarberService[]>([]);
  const [globalServices, setGlobalServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [customPrice, setCustomPrice] = useState('');
  const [savingService, setSavingService] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, profileRes, servicesRes] = await Promise.all([
        apiClient.get('/bookings/my'),
        apiClient.get(`/barbers/${user?._id}`),
        apiClient.get('/services'),
      ]);

      const allBookings: Booking[] = bookingsRes.data?.data?.bookings || [];
      setBookings(allBookings);

      const barberData = profileRes.data?.data?.barber;
      if (barberData?.services) setMyServices(barberData.services);

      const gs = servicesRes.data?.data?.services || servicesRes.data?.data || [];
      setGlobalServices(Array.isArray(gs) ? gs : []);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const todayBookings = bookings.filter(b => b.date === today);
  const pending = bookings.filter(b => b.status === 'pending');
  const completed = todayBookings.filter(b => b.status === 'completed');
  const earnedToday = completed.reduce((s, b) => s + b.amount, 0);

  const handleAccept = async (id: string) => {
    try {
      await apiClient.put(`/bookings/${id}/status`, { status: 'confirmed' });
      fetchData();
    } catch { Alert.alert('Error', 'Could not accept booking'); }
  };

  const handleReject = async (id: string) => {
    Alert.alert('Reject Booking', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        try {
          await apiClient.put(`/bookings/${id}/status`, { status: 'cancelled' });
          fetchData();
        } catch { Alert.alert('Error', 'Could not reject booking'); }
      }},
    ]);
  };

  const handleAddService = async () => {
    if (!selectedService || !customPrice) {
      Alert.alert('Error', 'Please select a service and enter a price.');
      return;
    }
    setSavingService(true);
    try {
      await apiClient.put('/barbers/services', {
        serviceId: selectedService._id,
        customPrice: parseFloat(customPrice),
      });

      // Update local state immediately for a snappy UI
      const newServiceEntry = {
        _id: Math.random().toString(), // Temp ID until next full fetch
        service: selectedService,
        customPrice: parseFloat(customPrice),
        isActive: true
      };
      
      setMyServices(prev => [...prev, newServiceEntry]);
      
      Alert.alert('Success', `${selectedService.name} added to your services!`);
      setShowAddService(false);
      setSelectedService(null);
      setCustomPrice('');
      
      // Still call fetchData to ensure backend sync is perfect in background
      fetchData();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to add service');
    } finally {
      setSavingService(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.gold} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Barber Panel 💈</Text>
          <Text style={styles.name}>{user?.name}</Text>
          {user?.shopName ? <Text style={styles.shopName}>📍 {user.shopName}</Text> : null}
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        {[
          { label: 'Today Done', value: completed.length.toString(), icon: '✅', color: Colors.success },
          { label: 'Upcoming', value: todayBookings.filter(b => b.status === 'confirmed').length.toString(), icon: '⏳', color: Colors.info },
          { label: 'Requests', value: pending.length.toString(), icon: '📩', color: Colors.warning },
          { label: 'Earned', value: `Rs.${earnedToday.toLocaleString()}`, icon: '💰', color: Colors.gold },
        ].map(kpi => (
          <View key={kpi.label} style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>{kpi.icon}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      {/* My Services */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Services</Text>
        <TouchableOpacity onPress={() => setShowAddService(true)}>
          <Text style={styles.addBtn}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      {myServices.length === 0 ? (
        <TouchableOpacity style={styles.emptyServiceCard} onPress={() => setShowAddService(true)}>
          <Text style={styles.emptyIcon}>✂️</Text>
          <Text style={styles.emptyTitle}>No services yet</Text>
          <Text style={styles.emptySubtitle}>Tap to add services you offer with your custom price</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
          {myServices.filter(s => s.isActive).map(s => (
            <View key={s._id} style={styles.serviceChip}>
              <Text style={styles.serviceChipIcon}>{s.service?.icon || '✂️'}</Text>
              <Text style={styles.serviceChipName}>{s.service?.name}</Text>
              <Text style={styles.serviceChipPrice}>Rs. {s.customPrice.toLocaleString()}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Pending Requests */}
      <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        <TouchableOpacity onPress={() => router.push('/(barber)/requests' as any)}>
          <Text style={styles.seeAll}>See All ({pending.length})</Text>
        </TouchableOpacity>
      </View>

      {pending.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No pending requests 🎉</Text>
        </View>
      ) : (
        pending.slice(0, 3).map(req => (
          <View key={req._id} style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <Text style={styles.reqCustomer}>{req.customer?.name || 'Unknown Customer'}</Text>
              <Text style={styles.reqService}>{req.service?.name || 'Unknown Service'}</Text>
              <Text style={styles.reqDate}>📅 {req.date || 'No Date'} · {req.startTime || 'No Time'}</Text>
            </View>
            <View style={styles.reqButtons}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(req._id)}>
                <Text style={styles.acceptText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(req._id)}>
                <Text style={styles.rejectText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Today's Schedule */}
      <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <TouchableOpacity onPress={() => router.push('/(barber)/schedule' as any)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {todayBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No appointments today</Text>
        </View>
      ) : (
        todayBookings.slice(0, 3).map(appt => (
          <View key={appt._id} style={styles.scheduleRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{appt.startTime}</Text>
            </View>
            <View style={styles.scheduleLine} />
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleInfo}>
                <Text style={styles.customerName}>{appt.customer?.name || 'Unknown Customer'}</Text>
                <Text style={styles.serviceName}>{appt.service?.name || 'Unknown Service'}</Text>
              </View>
              <Text style={[styles.scheduleAmount, { color: appt.status === 'completed' ? Colors.success : Colors.gold }]}>
                Rs. {appt.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 32 }} />

      {/* Add Service Modal */}
      <Modal visible={showAddService} animationType="slide" transparent onRequestClose={() => setShowAddService(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a Service</Text>
              <TouchableOpacity onPress={() => setShowAddService(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedService ? (
              <View style={styles.selectedServiceCard}>
                <Text style={styles.selectedServiceIcon}>{selectedService.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedServiceName}>{selectedService.name}</Text>
                  <Text style={styles.selectedServiceMeta}>Global price: Rs. {selectedService.price} · {selectedService.duration} min</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedService(null)}>
                  <Text style={{ color: Colors.textMuted }}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={globalServices}
                keyExtractor={item => item._id}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.serviceOption} onPress={() => setSelectedService(item)}>
                    <Text style={styles.serviceOptionIcon}>{item.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceOptionName}>{item.name}</Text>
                      <Text style={styles.serviceOptionMeta}>{item.category} · {item.duration} min</Text>
                    </View>
                    <Text style={styles.serviceOptionPrice}>Rs. {item.price}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {selectedService && (
              <>
                <Text style={styles.priceLabel}>Your Custom Price (Rs.)</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="e.g. 800"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={customPrice}
                  onChangeText={setCustomPrice}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleAddService} disabled={savingService}>
                  {savingService ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.saveBtnText}>Save Service</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  greeting: { color: Colors.textSecondary, fontSize: 13 },
  name: { color: Colors.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
  shopName: { color: Colors.gold, fontSize: 13, marginTop: 4 },
  kpiRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  kpiCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 3, borderWidth: 1, borderColor: Colors.border },
  kpiIcon: { fontSize: 18 },
  kpiValue: { fontSize: 13, fontWeight: '800' },
  kpiLabel: { color: Colors.textMuted, fontSize: 9, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  sectionTitle: { color: Colors.text, fontSize: 17, fontWeight: '800' },
  seeAll: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  addBtn: { color: Colors.gold, fontSize: 13, fontWeight: '700', borderWidth: 1, borderColor: Colors.gold, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  emptyServiceCard: { marginHorizontal: Spacing.lg, backgroundColor: Colors.card, borderRadius: Radius.md, padding: 28, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed', gap: 8 },
  emptyIcon: { fontSize: 32 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  emptySubtitle: { color: Colors.textMuted, fontSize: 13, textAlign: 'center' },
  serviceChip: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', minWidth: 100, gap: 4, marginBottom: 4 },
  serviceChipIcon: { fontSize: 24 },
  serviceChipName: { color: Colors.text, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  serviceChipPrice: { color: Colors.gold, fontSize: 11, fontWeight: '700' },
  emptyState: { marginHorizontal: Spacing.lg, padding: Spacing.lg, alignItems: 'center' },
  emptyStateText: { color: Colors.textMuted, fontSize: 14 },
  requestCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  requestInfo: { flex: 1, gap: 2 },
  reqCustomer: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  reqService: { color: Colors.textSecondary, fontSize: 13 },
  reqDate: { color: Colors.textMuted, fontSize: 12 },
  reqButtons: { flexDirection: 'row', gap: 6 },
  acceptBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.success },
  acceptText: { color: Colors.success, fontWeight: '800', fontSize: 14 },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.error + '22', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.error },
  rejectText: { color: Colors.error, fontWeight: '800', fontSize: 14 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  timeBox: { width: 60, alignItems: 'flex-end', marginRight: 8 },
  timeText: { color: Colors.gold, fontSize: 12, fontWeight: '700' },
  scheduleLine: { width: 2, height: 40, backgroundColor: Colors.gold + '44', marginRight: 8 },
  scheduleCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  scheduleInfo: { flex: 1 },
  customerName: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  serviceName: { color: Colors.textSecondary, fontSize: 12 },
  scheduleAmount: { fontWeight: '700', fontSize: 12 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  modalClose: { color: Colors.textMuted, fontSize: 20 },
  serviceOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  serviceOptionIcon: { fontSize: 24, width: 36, textAlign: 'center' },
  serviceOptionName: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  serviceOptionMeta: { color: Colors.textMuted, fontSize: 12 },
  serviceOptionPrice: { color: Colors.gold, fontWeight: '700' },
  selectedServiceCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold + '66', marginBottom: Spacing.md },
  selectedServiceIcon: { fontSize: 28 },
  selectedServiceName: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  selectedServiceMeta: { color: Colors.textMuted, fontSize: 12 },
  priceLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 4 },
  priceInput: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.text, fontSize: 16, marginBottom: Spacing.md },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: 12, padding: 16, alignItems: 'center' },
  saveBtnText: { color: Colors.background, fontWeight: '800', fontSize: 16 },
});
