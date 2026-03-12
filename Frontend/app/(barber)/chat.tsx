import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/Colors';
import { CHAT_CONVERSATIONS, CHAT_MESSAGES } from '@/constants/MockData';
import Avatar from '@/components/Avatar';
import ChatBubble from '@/components/ChatBubble';

const QUICK_REPLIES = ["Your booking is confirmed!", "Running on time", "Please be on time", "See you soon!"];

export default function BarberChatScreen() {
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [activeChat, setActiveChat] = useState(CHAT_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState('');

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: `m${Date.now()}`, senderId: 'b1', text: text.trim(), time: 'Just now', isRead: false }]);
    setInput('');
  }

  if (view === 'chat') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView('list')}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Avatar initials={activeChat.otherUser.initials} color={activeChat.otherUser.color} size={36} fontSize={13} />
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatName}>{activeChat.otherUser.name}</Text>
            <Text style={styles.chatRef}>{activeChat.bookingRef}</Text>
          </View>
        </View>
        <FlatList data={messages} keyExtractor={m => m.id} renderItem={({ item }) => (
          <ChatBubble text={item.text} time={item.time} isMe={item.senderId === 'b1'} isRead={item.isRead} />
        )} contentContainerStyle={{ paddingVertical: Spacing.md }} showsVerticalScrollIndicator={false} />
        <FlatList data={QUICK_REPLIES} horizontal showsHorizontalScrollIndicator={false} keyExtractor={q => q}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingVertical: 6, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.quickChip} onPress={() => sendMessage(item)}>
              <Text style={styles.quickText}>{item}</Text>
            </TouchableOpacity>
          )} />
        <View style={styles.inputBar}>
          <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={Colors.textMuted} value={input} onChangeText={setInput} multiline />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendDisabled]} onPress={() => sendMessage(input)}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Chats</Text>
      </View>
      {CHAT_CONVERSATIONS.map(conv => (
        <TouchableOpacity key={conv.id} style={styles.convRow} onPress={() => { setActiveChat(conv); setView('chat'); }} activeOpacity={0.8}>
          <View style={styles.convAvatarWrap}>
            <Avatar initials={conv.otherUser.initials} color={conv.otherUser.color} size={50} fontSize={18} />
            {conv.unreadCount > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{conv.unreadCount}</Text></View>}
          </View>
          <View style={styles.convInfo}>
            <Text style={styles.convName}>{conv.otherUser.name}</Text>
            <Text style={styles.convRef}>{conv.bookingRef}</Text>
            <Text style={styles.convLast} numberOfLines={1}>{conv.lastMessage}</Text>
          </View>
          <Text style={styles.convTime}>{conv.lastTime}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  convRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  convAvatarWrap: { position: 'relative' },
  unreadBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: Colors.gold, borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.background },
  unreadText: { color: Colors.black, fontSize: 9, fontWeight: '800' },
  convInfo: { flex: 1, gap: 2 },
  convName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  convRef: { color: Colors.gold, fontSize: 11 },
  convLast: { color: Colors.textSecondary, fontSize: 13 },
  convTime: { color: Colors.textMuted, fontSize: 11 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  backText: { color: Colors.text, fontSize: 18 },
  chatHeaderInfo: { flex: 1 },
  chatName: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  chatRef: { color: Colors.textMuted, fontSize: 11 },
  quickChip: { backgroundColor: Colors.card, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  quickText: { color: Colors.textSecondary, fontSize: 12 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface, paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.sm },
  input: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  sendDisabled: { backgroundColor: Colors.card },
  sendIcon: { color: Colors.black, fontSize: 16 },
});
