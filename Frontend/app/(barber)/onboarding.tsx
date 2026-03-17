import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/client';

export default function BarberOnboardingScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorVar, setErrorVar] = useState('');

  const [form, setForm] = useState({
    shopName: '',
    shopLocation: '',
    bio: ''
  });

  const handleCompleteSetup = async () => {
    if (!form.shopName || !form.shopLocation) {
      setErrorVar('Shop Name and Location are required.');
      return;
    }

    setLoading(true);
    setErrorVar('');

    try {
      // Intentionally using the new unified profile route to update shopName
      const res = await apiClient.put('/barbers/profile', form);
      
      // Update local auth context to reflect changes
      if (res.data?.data?.barber) {
        updateUser(res.data.data.barber);
      }
      
      router.replace('/(barber)');
    } catch (err: any) {
      setErrorVar(err.response?.data?.message || 'Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user?.name}!</Text>
          <Text style={styles.subtitle}>Let's set up your shop profile so customers can find you.</Text>
        </View>

        {errorVar ? <Text style={styles.errorText}>{errorVar}</Text> : null}

        <View style={styles.formContainer}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The Grooming Studio"
            placeholderTextColor={Colors.textMuted}
            value={form.shopName}
            onChangeText={(text) => setForm({ ...form, shopName: text })}
          />

          <Text style={styles.label}>Shop Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. DHA Phase 5, Lahore"
            placeholderTextColor={Colors.textMuted}
            value={form.shopLocation}
            onChangeText={(text) => setForm({ ...form, shopLocation: text })}
          />

          <Text style={styles.label}>Short Bio (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell customers a bit about your expertise..."
            placeholderTextColor={Colors.textMuted}
            value={form.bio}
            onChangeText={(text) => setForm({ ...form, bio: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleCompleteSetup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.submitButtonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: Colors.textMuted,
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: Colors.error,
    fontFamily: 'Outfit-Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.background,
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
  },
});
