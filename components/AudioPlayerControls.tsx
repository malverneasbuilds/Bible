import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Play, Pause, Square, Gauge } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface AudioPlayerControlsProps {
  visible: boolean;
  onClose: () => void;
  text: string;
  title: string;
}

export function AudioPlayerControls({ visible, onClose, text, title }: AudioPlayerControlsProps) {
  const { colors } = useTheme();
  const { isPlaying, isPaused, rate, speak, stop, pause, resume, changeRate } = useTextToSpeech();
  const [showRateControl, setShowRateControl] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(text);
    }
  };

  const handleStop = () => {
    stop();
    onClose();
  };

  const rateOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2x', value: 2.0 },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleStop}
        />

        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowRateControl(!showRateControl)}>
              <Gauge size={24} color={colors.text} />
              <Text style={[styles.rateText, { color: colors.text }]}>
                {rate}x
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handlePlayPause}>
              {isPlaying ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton, { backgroundColor: colors.surface }]}
              onPress={handleStop}>
              <Square size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {showRateControl && (
            <View style={[styles.rateSelector, { backgroundColor: colors.surface }]}>
              <Text style={[styles.rateSelectorTitle, { color: colors.textSecondary }]}>
                Playback Speed
              </Text>
              <View style={styles.rateOptions}>
                {rateOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.rateOption,
                      {
                        backgroundColor: rate === option.value ? colors.primary : 'transparent',
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => {
                      changeRate(option.value);
                      setShowRateControl(false);
                    }}>
                    <Text style={[
                      styles.rateOptionText,
                      { color: rate === option.value ? 'white' : colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              {isPlaying ? 'Playing...' : isPaused ? 'Paused' : 'Ready to play'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  controlButton: {
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: 80,
    height: 80,
  },
  secondaryButton: {
    width: 56,
    height: 56,
  },
  rateText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  rateSelector: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rateSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  rateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  rateOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  rateOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});
