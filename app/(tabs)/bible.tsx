import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBible } from '@/hooks/useBible';
import { BibleBooksList } from './bible/BibleBooksList';
import { BibleChaptersList } from './bible/BibleChaptersList';
import { BibleReader } from './bible/BibleReader';

export type BibleScreenMode = 'books' | 'chapters' | 'reader';

export default function BibleScreen() {
  const { colors } = useTheme();
  const { lastReadingPosition } = useBible();
  const [mode, setMode] = useState<BibleScreenMode>('books');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setMode('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setMode('reader');
  };

  const handleBackToBooks = () => {
    setMode('books');
    setSelectedBook('');
  };

  const handleBackToChapters = () => {
    setMode('chapters');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {mode === 'books' && (
        <BibleBooksList onBookSelect={handleBookSelect} />
      )}
      
      {mode === 'chapters' && (
        <BibleChaptersList 
          bookId={selectedBook}
          onChapterSelect={handleChapterSelect}
          onBack={handleBackToBooks}
        />
      )}
      
      {mode === 'reader' && (
        <BibleReader
          bookId={selectedBook}
          chapter={selectedChapter}
          onBack={handleBackToChapters}
          onBookChange={(bookId) => {
            setSelectedBook(bookId);
            setSelectedChapter(1);
          }}
          onChapterChange={(chapter) => {
            setSelectedChapter(chapter);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});