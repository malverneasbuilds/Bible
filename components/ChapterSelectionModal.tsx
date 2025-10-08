import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useTheme } from '@/hooks/useTheme';
import { useBible } from '@/hooks/useBible';

interface ChapterSelectionModalProps {
  visible: boolean;
  bookId: string;
  onClose: () => void;
  onChapterSelect: (chapter: number) => void;
}

export function ChapterSelectionModal({ visible, bookId, onClose, onChapterSelect }: ChapterSelectionModalProps) {
  const { colors } = useTheme();
  const { books, userProgress } = useBible();
  
  const book = books.find(b => b.id === bookId);
  const progress = userProgress.find(p => p.book === bookId);
  
  if (!book) return null;
  
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  const handleChapterPress = (chapter: number) => {
    onChapterSelect(chapter);
    onClose();
  };

  const renderChapter = ({ item: chapter }: { item: number }) => {
    const isRead = progress?.chaptersRead.includes(chapter) || false;
    const isLastRead = progress?.lastReadChapter === chapter;
    
    return (
      <TouchableOpacity
        style={[
          styles.chapterItem,
          { 
            backgroundColor: isRead ? colors.primary + '15' : colors.card,
            borderColor: isLastRead ? colors.primary : colors.border,
            borderWidth: isLastRead ? 2 : 1,
          }
        ]}
        onPress={() => handleChapterPress(chapter)}>
        <Text style={[
          styles.chapterNumber,
          { color: isRead ? colors.primary : colors.text }
        ]}>
          {chapter}
        </Text>
        {isRead && (
          <View style={[styles.readIndicator, { backgroundColor: colors.success }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent>
      <BlurView intensity={20} style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text }]}>
                {book.name}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Select a chapter
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Chapters Grid */}
          <FlatGrid
            itemDimension={60}
            data={chapters}
            style={styles.grid}
            spacing={12}
            renderItem={renderChapter}
            contentContainerStyle={styles.gridContent}
          />
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    padding: 20,
  },
  chapterItem: {
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  readIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});