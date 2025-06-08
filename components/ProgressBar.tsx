import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import styles from '../styles/PreferenceStyles';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const safeStep = Math.min(currentStep, totalSteps);
  const progress = totalSteps > 0 ? (safeStep / totalSteps) * 100 : 0;
  const progressText = `${Math.round(progress)}%`;

  return (
    <View style={styles.container2}>
      <View style={styles.backgroundBar}>
        {progress > 0 && (
          <LinearGradient
            colors={[Colors.activity, Colors.gradient]}
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

export default ProgressBar;
