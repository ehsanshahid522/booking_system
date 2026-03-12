import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { SERVICES } from '@/constants/MockData';

export default function AdminServicesScreen() {
  const [services, setServices] = useState(SERVICES);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');

  function deleteService(id: string) {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setServices(prev => prev.filter(s => s.id !== id)) },
    ]);
  }

  function addService() {
    if (!newName || !newPrice) { Alert.alert('Error', 'Fill name and price'); return; }
    const newSvc = {
      id: `s${Date.now()}`, name: newName, price: parseInt(newPrice), duration: parseInt(newDuration) || 30,
      category: 'Hair', description: '', icon: '✂️',
    };
    setServices(prev => [...prev, newSvc]);
    setNewName(''); setNewPrice(''); setNewDuration('');
    setShowForm(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addBtnText}>{showForm ? '✕ Cancel' : '+ Add'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>New Service</Text>
          <TextInput style={styles.input} placeholder="Service Name" placeholderTextColor={Colors.textMuted} value={newName} onChangeText={setNewName} />
          <View style={styles.formRow}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Price (Rs.)" placeholderTextColor={Colors.textMuted} value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Duration (min)" placeholderTextColor={Colors.textMuted} value={newDuration} onChangeText={setNewDuration} keyboardType="numeric" />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={addService}>
            <Text style={styles.saveBtnText}>Save Service</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }} showsVerticalScrollIndicator={false}>
        {services.map(svc => (
          <View key={svc.id} style={styles.card}>
            <Text style={styles.cardIcon}>{svc.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{svc.name}</Text>
              <Text style={styles.cardMeta}>{svc.category} · {svc.duration} min</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardPrice}>Rs. {svc.price.toLocaleString()}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteService(svc.id)}>
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  addBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 8, paddingHorizontal: 16 },
  addBtnText: { color: Colors.black, fontWeight: '700', fontSize: 13 },
  form: { backgroundColor: Colors.card, margin: Spacing.lg, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold + '66' },
  formTitle: { color: Colors.gold, fontSize: 14, fontWeight: '700', marginBottom: Spacing.sm },
  formRow: { flexDirection: 'row', gap: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: 14, marginBottom: Spacing.sm },
  saveBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 11, alignItems: 'center' },
  saveBtnText: { color: Colors.black, fontWeight: '800', fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  cardIcon: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardPrice: { color: Colors.gold, fontSize: 15, fontWeight: '800' },
  cardActions: { flexDirection: 'row', gap: 4 },
  editBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  editBtnText: { fontSize: 14 },
  deleteBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.error + '18', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '66' },
  deleteBtnText: { fontSize: 14 },
});
