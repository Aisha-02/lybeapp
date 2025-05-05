import React from 'react';
import { View, StyleSheet } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const safeStep = Math.min(currentStep, totalSteps);
  const progress = totalSteps > 0 ? (safeStep / totalSteps) * 100 : 0;

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    paddingHorizontal: 20,
    marginTop: 60,
  },
  backgroundBar: {
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
});

export default ProgressBar;
