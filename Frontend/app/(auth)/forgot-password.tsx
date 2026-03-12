import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');

  function handleReset() {
    if (!email.trim()) { Alert.alert('Enter Email', 'Please enter your email address.'); return; }
    Alert.alert('✅ Reset Link Sent', `A password reset link has been sent to ${email}`, [{ text: 'Back to Login', onPress: () => router.replace('/(auth)/login' as any) }]);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={styles.btn} onPress={handleReset} activeOpacity={0.85}>
            <Text style={styles.btnText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  back: { paddingTop: 56, paddingBottom: Spacing.xl },
  backText: { color: Colors.textSecondary, fontSize: 16 },
  center: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  icon: { fontSize: 64 },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  form: { gap: Spacing.sm },
  label: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  input: { backgroundColor: Colors.card, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: 15 },
  btn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: Spacing.sm },
  btnText: { color: Colors.black, fontSize: 16, fontWeight: '800' },
});
