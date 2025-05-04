import React from 'react';
import { View } from 'react-native';

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <View style={{ height: 6, backgroundColor: '#333', width: '100%' }}>
      <View
        style={{
          marginTop: 60,
          height: '100%',
          backgroundColor: '#1DB954', // Spotify green
          width: `${progress}%`,
        }}
      />
    </View>
  );
};

export default ProgressBar;
