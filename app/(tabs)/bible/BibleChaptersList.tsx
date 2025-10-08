import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, BookOpen } from 'lucide-react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';

interface BibleChaptersListProps {
  bookId: string;
  onChapterSelect: (chapter: number) => void;
  onBack: () => void;
}

export function BibleChaptersList({ bookId, onChapterSelect, onBack }: BibleChaptersListProps) {
  const { colors } = useTheme();
  const { books, userProgress } = useBible();
  
  const book = books.find(b => b.id === bookId);
  const progress = userProgress.find(p => p.book === bookId);
  
  if (!book) return null;
  
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

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
        onPress={() => onChapterSelect(chapter)}>
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
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>{book.name}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select a chapter to read
          </Text>
        </View>
      </View>

      {progress && (
        <View style={[styles.progressSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressInfo}>
            <BookOpen size={20} color={colors.primary} />
            <View style={styles.progressText}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Reading Progress
              </Text>
              <Text style={[styles.progressDetail, { color: colors.textSecondary }]}>
                {progress.chaptersRead.length} of {book.chapters} chapters read ({Math.round(progress.progressPercentage)}%)
              </Text>
            </View>
          </View>
          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressBar, 
                { backgroundColor: colors.primary, width: `${Math.min(progress.progressPercentage, 100)}%` }
              ]} 
            />
          </View>
        </View>
      )}

      <FlatGrid
        itemDimension={60}
        data={chapters}
        style={styles.grid}
        spacing={12}
        renderItem={renderChapter}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressSection: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    marginLeft: 12,
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  progressDetail: {
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
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