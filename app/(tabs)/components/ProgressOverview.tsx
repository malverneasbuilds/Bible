import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Book } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';

export function ProgressOverview() {
  const { colors } = useTheme();
  const { userProgress, books } = useBible();

  const recentProgress = userProgress.slice(-3);

  if (recentProgress.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Book size={32} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Start reading to see your progress here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {recentProgress.map((progress, index) => {
        const book = books.find(b => b.id === progress.book);
        return (
          <View key={index} style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.bookName, { color: colors.text }]}>
              {book?.name || progress.book}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { backgroundColor: colors.primary, width: `${Math.min(progress.progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {Math.round(progress.progressPercentage)}% complete
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  progressCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
  },
  bookName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
});