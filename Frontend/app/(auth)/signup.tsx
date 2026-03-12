import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const ROLES = [
  { label: 'Customer', value: 'customer' as UserRole, icon: '👤' },
  { label: 'Barber', value: 'barber' as UserRole, icon: '✂️' },
];

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    // Mock signup = auto login
    await login(email, password, role);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.emoji}>💈</Text>
          <Text style={styles.logoText}>BarberPro</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>
        </View>

        <View style={styles.card}>

          {/* Role */}
          <Text style={styles.label}>I am a</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleBtn, role === r.value && styles.roleBtnActive]}
                onPress={() => setRole(r.value)}
              >
                <Text style={styles.roleIcon}>{r.icon}</Text>
                <Text style={[styles.roleLabel, role === r.value && { color: Colors.gold }]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fields */}
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />

          <Text style={styles.label}>Email *</Text>
          <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="+92 3XX XXXXXXX" placeholderTextColor={Colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={styles.label}>Password *</Text>
          <TextInput style={styles.input} placeholder="Min. 6 characters" placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput style={styles.input} placeholder="Re-enter your password" placeholderTextColor={Colors.textMuted} value={confirm} onChangeText={setConfirm} secureTextEntry />

          {/* Terms */}
          <Text style={styles.terms}>
            By signing up, you agree to our <Text style={{ color: Colors.gold }}>Terms of Service</Text> and <Text style={{ color: Colors.gold }}>Privacy Policy</Text>
          </Text>

          {/* Submit */}
          <TouchableOpacity style={[styles.btn, loading && styles.disabledBtn]} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.btnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(auth)/login' as any)}>
          <Text style={styles.loginText}>Already have an account? <Text style={{ color: Colors.gold, fontWeight: '700' }}>Login</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  back: { paddingTop: 56, paddingBottom: Spacing.sm },
  backText: { color: Colors.textSecondary, fontSize: 16 },
  header: { alignItems: 'center', paddingVertical: Spacing.lg },
  emoji: { fontSize: 42 },
  logoText: { color: Colors.gold, fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  label: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.xs, marginTop: Spacing.md },
  roleRow: { flexDirection: 'row', gap: Spacing.sm },
  roleBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, gap: 4 },
  roleBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
  roleIcon: { fontSize: 26 },
  roleLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: 15 },
  terms: { color: Colors.textMuted, fontSize: 12, marginTop: Spacing.md, lineHeight: 18, textAlign: 'center' },
  btn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: Spacing.lg },
  disabledBtn: { opacity: 0.6 },
  btnText: { color: Colors.black, fontSize: 16, fontWeight: '800' },
  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
});
