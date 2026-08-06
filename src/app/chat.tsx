import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../constants/Colors';
import { useAppStore } from '../store/useAppStore';
import { processFinancialQuery, ChatMessage } from '../services/aiChatService';

const QUICK_PROMPTS = [
  'How much did I spend on food this month?',
  'Am I on track to meet my Emergency Fund?',
  'Can I afford a ₹45,000 gadget purchase?',
  'Give me my Net Worth breakdown',
];

export default function ChatScreen() {
  const router = useRouter();
  const { userName, transactions, goals, getSummary } = useAppStore();

  const summary = getSummary();

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'AI',
      text: `Hello ${userName}! 👋 I am your FinTracked AI Financial Assistant. Ask me anything about your earnings, food expenses, budget caps, or net worth!`,
      timestamp: 'Just now',
    },
  ]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'USER',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    try {
      const aiReplyText = await processFinancialQuery(query, summary, transactions, goals);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'AI',
        text: aiReplyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat Error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'USER';
    return (
      <View style={[styles.msgContainer, isUser ? styles.userContainer : styles.aiContainer]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color={FinTrackedColors.gold} />
          </View>
        )}
        <Surface style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]} elevation={0}>
          <Text style={[styles.msgText, isUser && styles.userMsgText]}>{item.text}</Text>
        </Surface>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={FinTrackedColors.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={18} color={FinTrackedColors.gold} />
          <Text variant="titleMedium" style={styles.headerTitle}>
            Chat with My Finances
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Messages Feed */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Prompt Pills */}
        <View style={styles.quickPromptSection}>
          <FlatList
            horizontal
            data={QUICK_PROMPTS}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSendMessage(item)}
                style={({ pressed }) => [styles.promptPill, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.promptText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask AI about your money..."
            placeholderTextColor={FinTrackedColors.textMuted}
            style={styles.textInput}
            textColor={FinTrackedColors.textPrimary}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            onSubmitEditing={() => handleSendMessage()}
          />
          <Pressable
            onPress={() => handleSendMessage()}
            disabled={isThinking || !inputText.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              (!inputText.trim() || isThinking) && styles.sendBtnDisabled,
              pressed && { opacity: 0.8 },
            ]}
          >
            {isThinking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  backBtn: {
    padding: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    marginLeft: 6,
  },
  chatArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    maxWidth: '84%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: FinTrackedColors.gold + '26',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: FinTrackedColors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: FinTrackedColors.surface,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
  },
  userMsgText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickPromptSection: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  promptPill: {
    backgroundColor: FinTrackedColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: FinTrackedColors.primary + '50',
    marginRight: 8,
  },
  promptText: {
    color: FinTrackedColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: FinTrackedColors.surface,
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder,
  },
  textInput: {
    flex: 1,
    backgroundColor: FinTrackedColors.surfaceVariant + '40',
    borderRadius: 20,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: FinTrackedColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendBtnDisabled: {
    backgroundColor: FinTrackedColors.surfaceVariant,
  },
});
