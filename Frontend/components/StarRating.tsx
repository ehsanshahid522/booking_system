import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export default function StarRating({ rating, reviewCount, size = 14 }: StarRatingProps) {
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: size, color: Colors.gold }}>★</Text>
      <Text style={[styles.rating, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>({reviewCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { color: Colors.text, fontWeight: '700' },
  count: { color: Colors.textSecondary },
});
