import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';

interface ChatBubbleProps {
  text: string;
  time: string;
  isMe: boolean;
  isRead?: boolean;
}

export default function ChatBubble({ text, time, isMe, isRead }: ChatBubbleProps) {
  return (
    <View style={[styles.wrapper, isMe ? styles.meWrapper : styles.themWrapper]}>
      <View style={[styles.bubble, isMe ? styles.meBubble : styles.themBubble]}>
        <Text style={[styles.text, isMe ? styles.meText : styles.themText]}>{text}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{time}</Text>
          {isMe && <Text style={styles.read}>{isRead ? '✓✓' : '✓'}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 3, paddingHorizontal: Spacing.md },
  meWrapper: { alignItems: 'flex-end' },
  themWrapper: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: Radius.md, padding: 10, paddingBottom: 6 },
  meBubble: { backgroundColor: Colors.gold + 'DD', borderBottomRightRadius: 4 },
  themBubble: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  text: { fontSize: 14, lineHeight: 20 },
  meText: { color: Colors.black },
  themText: { color: Colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 3 },
  time: { color: 'rgba(0,0,0,0.4)', fontSize: 10 },
  read: { color: 'rgba(0,0,0,0.4)', fontSize: 10 },
});
