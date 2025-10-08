import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';
import { VerseOfTheDay } from './components/VerseOfTheDay';
import { StreakCounter } from './components/StreakCounter';
import { ProgressOverview } from './components/ProgressOverview';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { userStreaks, userProgress } = useBible();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + '20', 'transparent']}
        style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Good morning! 🌅
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Let's spend time in God's Word today
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <StreakCounter />

        <VerseOfTheDay />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Progress
          </Text>
          <ProgressOverview />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
});