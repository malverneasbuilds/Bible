import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Moon, Sun, Bell, Trash2, ChartBar as BarChart3, Info } from 'lucide-react-native';
import { useBible } from '@/hooks/useBible';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { userStreaks } = useBible();

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Dark Mode',
          type: 'toggle' as const,
          value: theme === 'dark',
          onToggle: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Daily Reading Reminders',
          type: 'toggle' as const,
          value: false,
          onToggle: () => {},
        },
      ],
    },
    {
      title: 'Stats',
      items: [
        {
          icon: BarChart3,
          label: 'Reading Statistics',
          type: 'info' as const,
          value: `${userStreaks.totalDaysRead} days read`,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Trash2,
          label: 'Clear All Data',
          type: 'button' as const,
          destructive: true,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          label: 'App Version',
          type: 'info' as const,
          value: '1.0.0',
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your Bible app experience
        </Text>
      </View>

      <View style={styles.content}>
        {/* Streak Summary */}
        <View style={[styles.streakSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.streakTitle, { color: colors.text }]}>
            Your Reading Journey
          </Text>
          <View style={styles.streakStats}>
            <View style={styles.streakStat}>
              <Text style={[styles.streakNumber, { color: colors.primary }]}>
                {userStreaks.currentStreak}
              </Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                Current Streak
              </Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={[styles.streakNumber, { color: colors.success }]}>
                {userStreaks.longestStreak}
              </Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                Longest Streak
              </Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={[styles.streakNumber, { color: colors.warning }]}>
                {userStreaks.totalDaysRead}
              </Text>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                Total Days
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex !== section.items.length - 1 && {
                      borderBottomColor: colors.border,
                      borderBottomWidth: 1,
                    },
                  ]}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
                      <item.icon 
                        size={18} 
                        color={item.destructive ? colors.error : colors.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.settingLabel,
                      { color: item.destructive ? colors.error : colors.text }
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.primary + '40' }}
                      thumbColor={item.value ? colors.primary : colors.surface}
                    />
                  )}
                  
                  {item.type === 'info' && (
                    <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                      {item.value}
                    </Text>
                  )}
                  
                  {item.type === 'button' && (
                    <TouchableOpacity
                      style={[
                        styles.settingButton,
                        { backgroundColor: item.destructive ? colors.error + '15' : colors.surface }
                      ]}
                      onPress={item.onPress}>
                      <Text style={[
                        styles.settingButtonText,
                        { color: item.destructive ? colors.error : colors.text }
                      ]}>
                        Clear
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
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
  },
  streakSummary: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
  },
  settingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});