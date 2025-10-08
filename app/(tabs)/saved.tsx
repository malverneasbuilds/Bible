import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart, Highlighter, MessageCircle } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { useAI } from '@/hooks/useAI';
import { useTheme } from '@/hooks/useTheme';

type SavedScreenTab = 'saved' | 'highlighted' | 'chats';

export default function SavedScreen() {
  const { colors } = useTheme();
  const { savedVerses, highlightedVerses } = useBible();
  const { savedChats, loadSavedChats } = useAI();
  const [activeTab, setActiveTab] = useState<SavedScreenTab>('saved');

  useEffect(() => {
    loadSavedChats();
  }, []);

  const tabs = [
    { id: 'saved' as const, label: 'Saved', icon: Heart, count: savedVerses.length },
    { id: 'highlighted' as const, label: 'Highlighted', icon: Highlighter, count: highlightedVerses.length },
    { id: 'chats' as const, label: 'AI Chats', icon: MessageCircle, count: savedChats.length },
  ];

  const renderVerseItem = (verse: any, index: number) => (
    <View
      key={`${verse.id}-${index}`}
      style={[
        styles.verseItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: verse.highlighted ? (verse.highlightColor || colors.warning) : colors.border,
        }
      ]}>
      <View style={styles.verseHeader}>
        <Text style={[styles.verseReference, { color: colors.primary }]}>
          {verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} {verse.chapter}:{verse.verse}
        </Text>
        <Text style={[styles.verseDate, { color: colors.textSecondary }]}>
          {new Date(verse.savedAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.verseText, { color: colors.text }]}>
        "{verse.text}"
      </Text>
    </View>
  );

  const renderChatItem = (chat: any, index: number) => (
    <View
      key={`${chat.id}-${index}`}
      style={[styles.chatItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.chatHeader}>
        <Text style={[styles.chatTitle, { color: colors.text }]}>
          {chat.title}
        </Text>
        <Text style={[styles.chatDate, { color: colors.textSecondary }]}>
          {new Date(chat.savedAt).toLocaleDateString()}
        </Text>
      </View>
      {chat.verse && (
        <Text style={[styles.chatVerse, { color: colors.primary }]}>
          {chat.verse.book.charAt(0).toUpperCase() + chat.verse.book.slice(1)} {chat.verse.chapter}:{chat.verse.verse}
        </Text>
      )}
      <Text style={[styles.chatPreview, { color: colors.textSecondary }]}>
        {chat.messages.length} messages
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return savedVerses.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Heart size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No saved verses yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Save verses while reading to see them here
            </Text>
          </View>
        ) : (
          savedVerses.map(renderVerseItem)
        );

      case 'highlighted':
        return highlightedVerses.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Highlighter size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No highlighted verses yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Highlight verses while reading to see them here
            </Text>
          </View>
        ) : (
          highlightedVerses.map(renderVerseItem)
        );

      case 'chats':
        return savedChats.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MessageCircle size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No saved chats yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Save your AI conversations to see them here
            </Text>
          </View>
        ) : (
          savedChats.map(renderChatItem)
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Saved Content</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your saved verses and AI conversations
        </Text>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              { borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent' }
            ]}
            onPress={() => setActiveTab(tab.id)}>
            <tab.icon 
              size={18} 
              color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? colors.primary : colors.textSecondary }
            ]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  verseItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
  },
  verseDate: {
    fontSize: 12,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  chatItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  chatDate: {
    fontSize: 12,
  },
  chatVerse: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  chatPreview: {
    fontSize: 14,
  },
});