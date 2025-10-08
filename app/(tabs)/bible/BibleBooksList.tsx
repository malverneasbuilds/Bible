import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';

interface BibleBooksListProps {
  onBookSelect: (bookId: string) => void;
}

export function BibleBooksList({ onBookSelect }: BibleBooksListProps) {
  const { colors } = useTheme();
  const { books, userProgress } = useBible();

  const oldTestament = books.filter(book => book.testament === 'old');
  const newTestament = books.filter(book => book.testament === 'new');

  const getBookProgress = (bookId: string) => {
    const progress = userProgress.find(p => p.book === bookId);
    return progress?.progressPercentage || 0;
  };

  const renderBooks = (booksList: typeof books, title: string) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {booksList.map((book) => {
        const progress = getBookProgress(book.id);
        return (
          <TouchableOpacity
            key={book.id}
            style={[styles.bookItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => onBookSelect(book.id)}>
            <View style={[styles.bookIcon, { backgroundColor: colors.primary + '15' }]}>
              <Book size={20} color={colors.primary} />
            </View>
            <View style={styles.bookInfo}>
              <Text style={[styles.bookName, { color: colors.text }]}>{book.name}</Text>
              <Text style={[styles.bookMeta, { color: colors.textSecondary }]}>
                {book.chapters} chapters
              </Text>
              {progress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { backgroundColor: colors.primary, width: `${Math.min(progress, 100)}%` }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Holy Bible</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose a book to start reading
        </Text>
      </View>

      {renderBooks(newTestament, 'New Testament')}
      {renderBooks(oldTestament, 'Old Testament')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bookIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookMeta: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 30,
  },
});