import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Target, MessageCircle, Book, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';
import { VerseOfTheDay } from './components/VerseOfTheDay';
import { StreakCounter } from './components/StreakCounter';
import { ProgressOverview } from './components/ProgressOverview';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { userStreaks, userProgress, savedVerses, highlightedVerses } = useBible();

  const quickActions = [
    {
      title: 'Continue Reading',
      icon: Book,
      color: colors.primary,
      onPress: () => router.push('/(tabs)/bible'),
    },
    {
      title: 'Saved Verses',
      icon: Heart,
      color: colors.error,
      count: savedVerses.length + highlightedVerses.length,
      onPress: () => router.push('/(tabs)/saved'),
    },
  ];

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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={action.onPress}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                {action.count && (
                  <View style={[styles.badge, { backgroundColor: action.color }]}>
                    <Text style={styles.badgeText}>{action.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  quickActions: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});