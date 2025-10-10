import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Play, Pause, Maximize } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string | null;
  chapterTitle: string;
  isGenerating: boolean;
  error?: string | null;
  onClose: () => void;
}

export function VideoPlayerModal({
  visible,
  videoUrl,
  chapterTitle,
  isGenerating,
  error,
  onClose,
}: VideoPlayerModalProps) {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    console.log('Fullscreen requested');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent>
      <BlurView intensity={30} style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{chapterTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorTitle, { color: colors.error }]}>Error</Text>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <Text style={[styles.errorHint, { color: colors.textSecondary }]}>
                  Check console for more details
                </Text>
              </View>
            ) : isGenerating || !videoUrl ? (
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.generatingText, { color: colors.text }]}>
                  {isGenerating ? 'Generating video...' : 'Preparing video...'}
                </Text>
                <Text style={[styles.generatingSubtext, { color: colors.textSecondary }]}>
                  This may take 2-3 minutes. Please check back shortly.
                </Text>
              </View>
            ) : (
              <View style={styles.videoContainer}>
                {Platform.OS === 'web' ? (
                  <video
                    src={videoUrl}
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 12,
                    }}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadedData={() => setIsLoading(false)}
                  />
                ) : (
                  <>
                    <View style={[styles.videoPlaceholder, { backgroundColor: colors.card }]}>
                      {isLoading && (
                        <ActivityIndicator size="large" color={colors.primary} />
                      )}
                      <Text style={[styles.videoPlaceholderText, { color: colors.textSecondary }]}>
                        Video: {videoUrl}
                      </Text>
                    </View>

                    <View style={styles.controls}>
                      <TouchableOpacity
                        onPress={handlePlayPause}
                        style={[styles.controlButton, { backgroundColor: colors.primary }]}>
                        {isPlaying ? (
                          <Pause size={32} color="#fff" />
                        ) : (
                          <Play size={32} color="#fff" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleFullscreen}
                        style={[styles.controlButton, { backgroundColor: colors.card }]}>
                        <Maximize size={24} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: Math.min(width - 40, 800),
    maxHeight: height - 100,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  videoPlaceholderText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  generatingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  generatingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  generatingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    paddingVertical: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
