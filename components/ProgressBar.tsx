import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const safeStep = Math.min(currentStep, totalSteps);
  const progress = totalSteps > 0 ? (safeStep / totalSteps) * 100 : 0;
  const progressText = `${Math.round(progress)}%`;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        {progress > 0 && (
          <LinearGradient
            colors={['#E100FF', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progress}%` }]}
          />
        )}
      </View>
      <Text style={styles.percentageText}>{progressText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    paddingHorizontal: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  backgroundBar: {
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
  percentageText: {
    marginTop: 6,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProgressBar;
