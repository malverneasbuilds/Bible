import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Search } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useBible } from '@/hooks/useBible';
import { Verse } from '@/types/bible';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onVerseSelect: (verse: Verse) => void;
}

export function SearchModal({ visible, onClose, onVerseSelect }: SearchModalProps) {
  const { colors } = useTheme();
  const { searchVerses } = useBible();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await searchVerses(searchQuery.trim());
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleVersePress = (verse: Verse) => {
    onVerseSelect(verse);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setSearchResults([]);
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
            <Text style={[styles.title, { color: colors.text }]}>
              Search Bible
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for verses..."
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>
          </View>

          {/* Search Results */}
          <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
            {isSearching && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Searching...
                </Text>
              </View>
            )}

            {searchQuery.trim().length > 0 && searchQuery.trim().length <= 2 && (
              <View style={[styles.hintContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Type at least 3 characters to search
                </Text>
              </View>
            )}

            {searchQuery.trim().length > 2 && !isSearching && searchResults.length === 0 && (
              <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Search size={32} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No verses found
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Try different keywords
                </Text>
              </View>
            )}

            {searchResults.map((verse, index) => (
              <TouchableOpacity
                key={`${verse.id}-${index}`}
                style={[styles.verseItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handleVersePress(verse)}>
                <View style={styles.verseHeader}>
                  <Text style={[styles.verseReference, { color: colors.primary }]}>
                    {verse.book.charAt(0).toUpperCase() + verse.book.slice(1)} {verse.chapter}:{verse.verse}
                  </Text>
                </View>
                <Text style={[styles.verseText, { color: colors.text }]}>
                  "{verse.text}"
                </Text>
              </TouchableOpacity>
            ))}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  hintContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 20,
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
  },
  verseHeader: {
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 14,
    fontWeight: '600',
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});