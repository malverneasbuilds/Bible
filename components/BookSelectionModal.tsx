import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Search, Book, SortAsc, List } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBible } from '@/hooks/useBible';
import { Book as BookType } from '@/types/bible';

interface BookSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onBookSelect: (bookId: string) => void;
}

export function BookSelectionModal({ visible, onClose, onBookSelect }: BookSelectionModalProps) {
  const { colors } = useTheme();
  const { books } = useBible();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'traditional' | 'alphabetical'>('traditional');

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortMode === 'alphabetical') {
      return a.name.localeCompare(b.name);
    }
    return 0; // Keep traditional order
  });

  const oldTestament = sortedBooks.filter(book => book.testament === 'old');
  const newTestament = sortedBooks.filter(book => book.testament === 'new');

  const handleBookPress = (bookId: string) => {
    onBookSelect(bookId);
    onClose();
    setSearchQuery('');
  };

  const renderBooks = (booksList: BookType[], title: string) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {booksList.map((book) => (
        <TouchableOpacity
          key={book.id}
          style={[styles.bookItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => handleBookPress(book.id)}>
          <View style={[styles.bookIcon, { backgroundColor: colors.primary + '15' }]}>
            <Book size={18} color={colors.primary} />
          </View>
          <View style={styles.bookInfo}>
            <Text style={[styles.bookName, { color: colors.text }]}>{book.name}</Text>
            <Text style={[styles.bookMeta, { color: colors.textSecondary }]}>
              {book.chapters} chapters
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

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
            <Text style={[styles.title, { color: colors.text }]}>
              Select Book
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search books..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Sort Options */}
          <View style={[styles.sortContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                { 
                  backgroundColor: sortMode === 'traditional' ? colors.primary + '15' : 'transparent',
                  borderColor: sortMode === 'traditional' ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setSortMode('traditional')}>
              <List size={16} color={sortMode === 'traditional' ? colors.primary : colors.textSecondary} />
              <Text style={[
                styles.sortButtonText,
                { color: sortMode === 'traditional' ? colors.primary : colors.textSecondary }
              ]}>
                Traditional
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                { 
                  backgroundColor: sortMode === 'alphabetical' ? colors.primary + '15' : 'transparent',
                  borderColor: sortMode === 'alphabetical' ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setSortMode('alphabetical')}>
              <SortAsc size={16} color={sortMode === 'alphabetical' ? colors.primary : colors.textSecondary} />
              <Text style={[
                styles.sortButtonText,
                { color: sortMode === 'alphabetical' ? colors.primary : colors.textSecondary }
              ]}>
                Alphabetical
              </Text>
            </TouchableOpacity>
          </View>

          {/* Books List */}
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {sortMode === 'traditional' ? (
              <>
                {renderBooks(newTestament, 'New Testament')}
                {renderBooks(oldTestament, 'Old Testament')}
              </>
            ) : (
              renderBooks(sortedBooks, 'All Books')
            )}
          </ScrollView>
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
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookMeta: {
    fontSize: 13,
  },
});