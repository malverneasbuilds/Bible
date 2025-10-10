import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Send, Save, Bot, User } from 'lucide-react-native';
import Constants from 'expo-constants';
import { useTheme } from '@/hooks/useTheme';
import { Verse, ChatMessage } from '@/types/bible';

interface AIChatModalProps {
  visible: boolean;
  verse?: Verse | null;
  chatId?: string | null;
  existingMessages?: ChatMessage[];
  onClose: () => void;
  onChatSaved?: (chatId: string) => void;
}

export function AIChatModal({ visible, verse, chatId: initialChatId, existingMessages, onClose, onChatSaved }: AIChatModalProps) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(existingMessages || []);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(initialChatId || null);
  const scrollViewRef = useRef<ScrollView>(null);
  const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (visible && existingMessages && existingMessages.length > 0) {
      setMessages(existingMessages);
      setChatId(initialChatId || null);
    } else if (visible && !existingMessages) {
      setMessages([]);
      setChatId(null);
    }
  }, [visible, existingMessages, initialChatId]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = messages.map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          verse: verse ? {
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
          } : null,
          chatId,
          messages: apiMessages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          text: messageText,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          isUser: false,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage, aiMessage]);

        if (data.chatId && !chatId) {
          setChatId(data.chatId);
          onChatSaved?.(data.chatId);
        }
      } else {
        Alert.alert('Error', data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      Alert.alert('Error', 'Failed to connect to AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = () => {
    if (chatId) {
      Alert.alert('Chat Saved', 'Your conversation is automatically saved.');
    } else if (messages.length === 0) {
      Alert.alert('Nothing to Save', 'Start a conversation first.');
    } else {
      Alert.alert('Auto-Save', 'Your chat will be saved automatically when you send your first message.');
    }
  };

  const handleClose = () => {
    if (!existingMessages) {
      setMessages([]);
      setChatId(null);
    }
    setInputText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent>
      <BlurView intensity={20} style={styles.overlay}>
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: colors.text }]}>
                  AI Bible Discussion
                </Text>
                {verse && (
                  <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} {verse.chapter}:{verse.verse}
                  </Text>
                )}
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.headerButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveChat}>
                  <Save size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={handleClose}>
                  <X size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}>
              {verse && (
                <View style={[styles.verseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.verseText, { color: colors.text }]}>
                    "{verse.text}"
                  </Text>
                  <Text style={[styles.verseReference, { color: colors.textSecondary }]}>
                    {verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} {verse.chapter}:{verse.verse}
                  </Text>
                </View>
              )}

              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}>
                  <View style={styles.messageHeader}>
                    <View style={[
                      styles.messageIcon,
                      { backgroundColor: message.isUser ? colors.primary + '15' : colors.surface }
                    ]}>
                      {message.isUser ? (
                        <User size={16} color={colors.primary} />
                      ) : (
                        <Bot size={16} color={colors.textSecondary} />
                      )}
                    </View>
                    <Text style={[styles.messageSender, { color: colors.textSecondary }]}>
                      {message.isUser ? 'You' : 'AI Assistant'}
                    </Text>
                  </View>
                  <View style={[
                    styles.messageBubble,
                    {
                      backgroundColor: message.isUser ? colors.primary + '10' : colors.surface,
                      borderColor: message.isUser ? colors.primary + '20' : colors.border,
                    }
                  ]}>
                    <Text style={[styles.messageText, { color: colors.text }]}>
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}

              {isLoading && (
                <View style={[styles.messageContainer, styles.aiMessage]}>
                  <View style={styles.messageHeader}>
                    <View style={[styles.messageIcon, { backgroundColor: colors.surface }]}>
                      <Bot size={16} color={colors.textSecondary} />
                    </View>
                    <Text style={[styles.messageSender, { color: colors.textSecondary }]}>
                      AI Assistant
                    </Text>
                  </View>
                  <View style={[
                    styles.messageBubble,
                    { backgroundColor: colors.surface, borderColor: colors.border }
                  ]}>
                    <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                      Thinking...
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
                ]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about this verse..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { 
                    backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.border,
                  }
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}>
                <Send size={18} color={inputText.trim() && !isLoading ? 'white' : colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  verseCard: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 13,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});