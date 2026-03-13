import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const ROLES: { label: string; value: UserRole; icon: string; desc: string }[] = [
  { label: 'Customer', value: 'customer', icon: '👤', desc: 'Book appointments' },
  { label: 'Barber', value: 'barber', icon: '✂️', desc: 'Manage schedule' },
  { label: 'Admin', value: 'admin', icon: '🛡️', desc: 'Full control' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) Alert.alert('Login Failed', 'Please check your credentials.');
  }



  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.emoji}>💈</Text>
          <Text style={styles.logoText}>BarberPro</Text>
          <Text style={styles.tagline}>Premium Grooming at Your Fingertips</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>



          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passWrap}>
            <TextInput
              style={styles.passInput}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as any)}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={[styles.loginBtn, loading && styles.disabledBtn]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>


        </View>

        {/* Sign Up Link */}
        <TouchableOpacity style={styles.signupLink} onPress={() => router.push('/(auth)/signup' as any)}>
          <Text style={styles.signupText}>Don't have an account? <Text style={{ color: Colors.gold, fontWeight: '700' }}>Sign Up</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  logoSection: { alignItems: 'center', paddingTop: 60, paddingBottom: Spacing.xl },
  emoji: { fontSize: 56 },
  logoText: { color: Colors.gold, fontSize: 32, fontWeight: '900', letterSpacing: 1, marginTop: Spacing.sm },
  tagline: { color: Colors.textSecondary, fontSize: 14, marginTop: Spacing.xs },
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', marginBottom: Spacing.md },
  label: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.xs, marginTop: Spacing.md },
  roleRow: { flexDirection: 'row', gap: Spacing.sm },
  roleBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  roleBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
  roleIcon: { fontSize: 22, marginBottom: 2 },
  roleLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  roleLabelActive: { color: Colors.gold },
  roleDesc: { color: Colors.textMuted, fontSize: 10, marginTop: 1 },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: 15 },
  passWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  passInput: { flex: 1, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: 15 },
  eyeBtn: { padding: Spacing.md },
  eyeText: { fontSize: 18 },
  forgotText: { color: Colors.gold, fontSize: 13, marginTop: Spacing.sm, textAlign: 'right' },
  loginBtn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: Spacing.lg },
  disabledBtn: { opacity: 0.6 },
  loginBtnText: { color: Colors.black, fontSize: 16, fontWeight: '800' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: 12 },
  demoRow: { flexDirection: 'row', gap: Spacing.sm },
  demoBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 3 },
  demoIcon: { fontSize: 22 },
  demoBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  signupLink: { alignItems: 'center', marginTop: Spacing.lg },
  signupText: { color: Colors.textSecondary, fontSize: 14 },
});
