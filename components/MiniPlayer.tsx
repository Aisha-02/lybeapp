// components/MiniPlayer.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Easing,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress, State, Event } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../navigation/NavigationRef';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(250);
  const [track, setTrack] = useState<any>(null);
  const [visible, setVisible] = useState(true);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const artistAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchTrack = async () => {
      const trackId = await TrackPlayer.getCurrentTrack();
      if (trackId === null) {
        setTrack(null);
        return;
      }
      const currentTrack = await TrackPlayer.getTrack(trackId);
      setTrack(currentTrack);
    };

    fetchTrack();

    const listener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, fetchTrack);
    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (!track) return;

    // Title scrolling
    titleAnim.setValue(0);
    Animated.loop(
      Animated.timing(titleAnim, {
        toValue: -width,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Artist scrolling
    artistAnim.setValue(0);
    Animated.loop(
      Animated.timing(artistAnim, {
        toValue: -width,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [track]);

  const togglePlayback = async () => {
    if (playbackState.state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  const seekTo = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  if (!track || !visible) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color="white" />
        </TouchableOpacity>

        {/* Track Artwork */}
        <Image source={{ uri: track.artwork }} style={styles.artwork} />

        {/* Track Info */}
        <View style={styles.info}>
          <Animated.View
            style={{
              transform: [{ translateX: titleAnim }],
            }}
          >
            <Text style={styles.title}>{track.title}</Text>
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ translateX: artistAnim }],
            }}
          >
            <Text style={styles.artist}>{track.artist}</Text>
          </Animated.View>
        </View>

        {/* Play/Pause */}
        <TouchableOpacity onPress={togglePlayback}>
          <Ionicons
            name={playbackState.state === State.Playing ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration || 1}
        value={position}
        onSlidingComplete={seekTo}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#999"
        thumbTintColor="#1DB954"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  closeBtn: {
    position: 'absolute',
    top: 4,
    left: 4,
    zIndex: 10,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 8,
    overflow: 'hidden',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  artist: {
    color: 'gray',
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 20,
  },
});

export default MiniPlayer;
