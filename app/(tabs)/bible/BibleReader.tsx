import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronDown, Volume2, Search, Video } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';
import { useChapterVideo } from '@/hooks/useChapterVideo';
import { Verse } from '@/types/bible';
import { VerseActions } from './components/VerseActions';
import { AIChatModal } from '@/components/AIChatModal';
import { BookSelectionModal } from '@/components/BookSelectionModal';
import { ChapterSelectionModal } from '@/components/ChapterSelectionModal';
import { SearchModal } from '@/components/SearchModal';
import { AudioPlayerControls } from '@/components/AudioPlayerControls';
import { VideoPlayerModal } from '@/components/VideoPlayerModal';

interface BibleReaderProps {
  bookId: string;
  chapter: number;
  onBack: () => void;
  onBookChange?: (bookId: string) => void;
  onChapterChange?: (chapter: number) => void;
}

export function BibleReader({ bookId, chapter, onBack, onBookChange, onChapterChange }: BibleReaderProps) {
  const { colors } = useTheme();
  const { books, getVersesByChapter, updateReadingProgress, isVerseHighlighted } = useBible();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showBookSelection, setShowBookSelection] = useState(false);
  const [showChapterSelection, setShowChapterSelection] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const book = books.find(b => b.id === bookId);
  const bookNumber = book ? books.indexOf(book) + 1 : 0;
  const { video, isLoading: videoLoading, error: videoError, generateVideo } = useChapterVideo(bookNumber, chapter);

  useEffect(() => {
    const loadChapter = async () => {
      const chapterVerses = await getVersesByChapter(bookId, chapter);
      setVerses(chapterVerses);

      if (chapterVerses.length > 0) {
        updateReadingProgress(bookId, chapter);
      }
    };

    loadChapter();
  }, [bookId, chapter]);

  const handleVersePress = (verse: Verse) => {
    setSelectedVerse(verse);
    setShowActions(true);
  };

  const handleReadAloud = () => {
    setShowAudioPlayer(true);
  };

  const handleTalkToAI = () => {
    setShowActions(false);
    setShowAIChat(true);
  };

  const handleBookSelect = (newBookId: string) => {
    onBookChange?.(newBookId);
  };

  const handleChapterSelect = (newChapter: number) => {
    onChapterChange?.(newChapter);
  };

  const handleVerseFromSearch = (verse: Verse) => {
    // Navigate to the verse's book and chapter
    if (verse.book !== bookId) {
      onBookChange?.(verse.book);
    }
    if (verse.chapter !== chapter) {
      onChapterChange?.(verse.chapter);
    }
    // Highlight the selected verse temporarily
    setSelectedVerse(verse);
    setTimeout(() => setSelectedVerse(null), 3000);
  };

  const handleWatchStory = async () => {
    setShowVideoPlayer(true);

    if (!video || video.status === 'failed') {
      generateVideo();
    }
  };

  if (!book) return null;

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => setShowBookSelection(true)}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {book.name} {chapter}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.chapterButton}
                onPress={() => setShowChapterSelection(true)}>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {verses.length} verses
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowSearch(true)}>
            <Search size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleWatchStory}
            disabled={videoLoading}>
            <Video size={20} color={video?.status === 'completed' ? colors.success : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleReadAloud}>
            <Volume2 size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.verses}>
          {verses.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No verses available for this chapter yet.
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                This is a demo with limited content.
              </Text>
            </View>
          ) : (
            <View style={styles.continuousText}>
              <Text style={[styles.chapterText, { color: colors.text }]}>
                {verses.map((verse, index) => (
                  <Text key={verse.id}>
                    <Text
                      style={[styles.inlineVerseNumber, { color: colors.textSecondary }]}
                      onPress={() => handleVersePress(verse)}>
                      {verse.verse}
                    </Text>
                    <Text style={[styles.verseTextInline, { color: colors.text }]}>
                      {verse.text}
                      {index < verses.length - 1 ? ' ' : ''}
                    </Text>
                  </Text>
                ))}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <VerseActions
        visible={showActions}
        verse={selectedVerse}
        onClose={() => setShowActions(false)}
        onTalkToAI={handleTalkToAI}
      />

      <AIChatModal
        visible={showAIChat}
        verse={selectedVerse}
        onClose={() => setShowAIChat(false)}
      />

      <BookSelectionModal
        visible={showBookSelection}
        onClose={() => setShowBookSelection(false)}
        onBookSelect={handleBookSelect}
      />

      <ChapterSelectionModal
        visible={showChapterSelection}
        bookId={bookId}
        onClose={() => setShowChapterSelection(false)}
        onChapterSelect={handleChapterSelect}
      />

      <SearchModal
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onVerseSelect={handleVerseFromSearch}
      />

      <AudioPlayerControls
        visible={showAudioPlayer}
        onClose={() => setShowAudioPlayer(false)}
        text={verses.map(v => v.text).join(' ')}
        title={`${book.name} ${chapter}`}
      />

      <VideoPlayerModal
        visible={showVideoPlayer}
        videoUrl={video?.video_url || null}
        chapterTitle={`${book.name} ${chapter}`}
        isGenerating={video?.status === 'generating'}
        error={videoError || video?.error_message}
        onClose={() => setShowVideoPlayer(false)}
      />
    </>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
  },
  chapterButton: {
    padding: 4,
    marginLeft: 8,
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  verses: {
    padding: 20,
  },
  continuousText: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  chapterText: {
    fontSize: 17,
    lineHeight: 28,
  },
  inlineVerseNumber: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
    marginLeft: 6,
  },
  verseTextInline: {
    fontSize: 17,
    lineHeight: 28,
  },
  verse: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 24,
    paddingTop: 2,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});