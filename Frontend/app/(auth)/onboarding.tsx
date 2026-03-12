import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '💈',
    title: 'Premium Grooming',
    subtitle: 'Book top barbers in your area with just a few taps. No waiting, no hassle.',
    bg: '#C9A84C22',
  },
  {
    icon: '📅',
    title: 'Easy Scheduling',
    subtitle: 'Choose your preferred time slot. View real-time availability of all barbers.',
    bg: '#1E88E522',
  },
  {
    icon: '💬',
    title: 'Stay Connected',
    subtitle: 'Chat directly with your barber. Get instant notifications on every booking update.',
    bg: '#4CAF5022',
  },
  {
    icon: '⭐',
    title: 'Top Rated Service',
    subtitle: 'Read genuine reviews. Rate your experience and help others find the best barbers.',
    bg: '#9C27B022',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
      setActiveIndex(activeIndex + 1);
    } else {
      router.replace('/(auth)/login' as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>💈 BarberPro</Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login' as any)}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scroll}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={[styles.iconWrap, { backgroundColor: slide.bg }]}>
              <Text style={styles.slideIcon}>{slide.icon}</Text>
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
        ))}
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.btnText}>
            {activeIndex < SLIDES.length - 1 ? 'Next →' : 'Get Started'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: Colors.gold }}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  logo: { color: Colors.gold, fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  skip: { color: Colors.textSecondary, fontSize: 14 },
  scroll: { flex: 1 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.lg },
  iconWrap: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  slideIcon: { fontSize: 72 },
  slideTitle: { color: Colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  slideSubtitle: { color: Colors.textSecondary, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  activeDot: { backgroundColor: Colors.gold, width: 24 },
  footer: { paddingHorizontal: Spacing.lg, paddingBottom: 40, gap: Spacing.md },
  btn: { backgroundColor: Colors.gold, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: Colors.black, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  loginLink: { alignItems: 'center' },
  loginLinkText: { color: Colors.textSecondary, fontSize: 14 },
});
