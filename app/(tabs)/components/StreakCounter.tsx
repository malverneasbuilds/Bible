import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Calendar, Target } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';

export function StreakCounter() {
  const { colors } = useTheme();
  const { userStreaks } = useBible();

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${userStreaks.currentStreak} days`,
      color: colors.warning,
    },
    {
      icon: Target,
      label: 'Longest Streak',
      value: `${userStreaks.longestStreak} days`,
      color: colors.success,
    },
    {
      icon: Calendar,
      label: 'Total Days',
      value: `${userStreaks.totalDaysRead} days`,
      color: colors.primary,
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
            <stat.icon size={20} color={stat.color} />
          </View>
          <Text style={[styles.value, { color: colors.text }]}>{stat.value}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});