import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Copy, Heart, Highlighter, MessageCircle, X } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';
import { Verse } from '@/types/bible';

interface VerseActionsProps {
  visible: boolean;
  verse: Verse | null;
  onClose: () => void;
  onTalkToAI: () => void;
}

export function VerseActions({ visible, verse, onClose, onTalkToAI }: VerseActionsProps) {
  const { colors } = useTheme();
  const { saveVerse, highlightVerse, isVerseSaved, isVerseHighlighted } = useBible();

  if (!verse) return null;

  const handleCopy = async () => {
    const verseText = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse}`;
    await Clipboard.setStringAsync(verseText);
    onClose();
  };

  const handleSave = async () => {
    if (!isVerseSaved(verse)) {
      await saveVerse(verse);
    }
    onClose();
  };

  const handleHighlight = async () => {
    if (!isVerseHighlighted(verse)) {
      await highlightVerse(verse);
    }
    onClose();
  };

  const actions = [
    {
      icon: Copy,
      label: 'Copy',
      onPress: handleCopy,
      color: colors.textSecondary,
    },
    {
      icon: Heart,
      label: isVerseSaved(verse) ? 'Saved' : 'Save',
      onPress: handleSave,
      color: isVerseSaved(verse) ? colors.error : colors.textSecondary,
      disabled: isVerseSaved(verse),
    },
    {
      icon: Highlighter,
      label: isVerseHighlighted(verse) ? 'Highlighted' : 'Highlight',
      onPress: handleHighlight,
      color: isVerseHighlighted(verse) ? colors.warning : colors.textSecondary,
      disabled: isVerseHighlighted(verse),
    },
    {
      icon: MessageCircle,
      label: 'Talk to AI',
      onPress: onTalkToAI,
      color: colors.primary,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent>
      <BlurView intensity={20} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.reference, { color: colors.text }]}>
              {verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} {verse.chapter}:{verse.verse}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.verseText, { color: colors.textSecondary }]}>
            "{verse.text}"
          </Text>

          <View style={styles.actions}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.action,
                  { 
                    backgroundColor: colors.surface,
                    opacity: action.disabled ? 0.5 : 1,
                  }
                ]}
                onPress={action.onPress}
                disabled={action.disabled}>
                <action.icon size={20} color={action.color} />
                <Text style={[styles.actionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reference: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: '48%',
    gap: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});