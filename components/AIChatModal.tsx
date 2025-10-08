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
import { useTheme } from '@/hooks/useTheme';
import { useAI } from '@/hooks/useAI';
import { Verse, ChatMessage, SavedChat } from '@/types/bible';

interface AIChatModalProps {
  visible: boolean;
  verse?: Verse | null;
  onClose: () => void;
}

export function AIChatModal({ visible, verse, onClose }: AIChatModalProps) {
  const { colors } = useTheme();
  const { generateAIResponse, saveChat, isLoading } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && verse && messages.length === 0) {
      // Initialize conversation with verse context
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `I'd like to discuss this verse: "${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      
      // Generate initial AI response
      generateAIResponse(initialMessage.text, verse).then((response) => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
      });
    }
  }, [visible, verse]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const response = await generateAIResponse(userMessage.text, verse);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  };

  const handleSaveChat = () => {
    if (messages.length === 0) {
      Alert.alert('Nothing to Save', 'Start a conversation first before saving.');
      return;
    }

    const chat: SavedChat = {
      id: Date.now().toString(),
      title: verse ? `Discussion: ${verse.book} ${verse.chapter}:${verse.verse}` : 'Bible Discussion',
      verse: verse || undefined,
      messages,
      savedAt: new Date().toISOString(),
    };

    saveChat(chat);
    Alert.alert('Chat Saved', 'Your conversation has been saved successfully.');
  };

  const handleClose = () => {
    setMessages([]);
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