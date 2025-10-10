import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MessageCircle, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';
import { AIChatModal } from '@/components/AIChatModal';

export function VerseOfTheDay() {
  const { colors } = useTheme();
  const { getVerseOfTheDay, saveVerse, isVerseSaved } = useBible();
  const [showAIChat, setShowAIChat] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const verseOfTheDay = getVerseOfTheDay();

  useEffect(() => {
    const saved = isVerseSaved(verseOfTheDay);
    setIsSaved(saved);
  }, [verseOfTheDay.id]);

  const handleSaveVerse = async () => {
    if (isSaved) {
      Alert.alert('Already Saved', 'This verse is already in your saved verses.');
      return;
    }
    await saveVerse(verseOfTheDay);
    setIsSaved(true);
    Alert.alert('Saved!', 'Verse added to your saved verses.');
  };

  return (
    <>
      <View style={[styles.container, { borderColor: colors.border }]}>
        <LinearGradient
          colors={[colors.primary + '10', 'transparent']}
          style={styles.gradient}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Verse of the Day
          </Text>
          
          <Text style={[styles.verse, { color: colors.text }]}>
            "{verseOfTheDay.text}"
          </Text>
          
          <Text style={[styles.reference, { color: colors.textSecondary }]}>
            {verseOfTheDay.book.charAt(0).toUpperCase() + verseOfTheDay.book.slice(1)} {verseOfTheDay.chapter}:{verseOfTheDay.verse}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAIChat(true)}>
              <MessageCircle size={18} color="white" />
              <Text style={styles.actionButtonText}>Dive Deeper</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: isSaved ? colors.primary + '15' : colors.card,
                  borderColor: isSaved ? colors.primary : colors.border,
                }
              ]}
              onPress={handleSaveVerse}>
              <Heart
                size={18}
                color={isSaved ? colors.primary : colors.textSecondary}
                fill={isSaved ? colors.primary : 'none'}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <AIChatModal
        visible={showAIChat}
        verse={verseOfTheDay}
        onClose={() => setShowAIChat(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  gradient: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  verse: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  reference: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});