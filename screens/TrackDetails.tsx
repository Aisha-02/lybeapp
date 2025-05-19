import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import YoutubePlayer from "react-native-youtube-iframe";
import styles from "../styles/TrackDetails"; // Adjust the import path as necessary

const { width } = Dimensions.get("window");

const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY_HERE"; // <-- Put your key here!

const TrackDetails = ({ route, navigation }: any) => {
  const { track } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  // YouTube video ID state
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);

  // Load Spotify audio preview
  const loadAudio = async () => {
    if (!track.preview_url) return;
    setLoading(true);

    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: track.preview_url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true);
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (err) {
      console.error("Error loading audio", err);
      Alert.alert("Audio Error", "Failed to load audio preview.");
    } finally {
      setLoading(false);
    }
  };

  // Playback status update
  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis);
    setDuration(status.durationMillis || 0);

    if (status.didJustFinish) {
      setIsPlaying(false);
      soundRef.current?.setPositionAsync(0);
    }
  };

  // Play/pause toggle
  const togglePlayback = async () => {
    if (!soundRef.current) {
      await loadAudio();
    } else {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  // Seek on slider complete
  const onSlidingComplete = async (value: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value);
  };

  // Fetch YouTube videoId using YouTube Data API v3
  const fetchYoutubeVideoId = useCallback(async () => {
    setYtLoading(true);
    setYtError(null);

    try {
      const query = `${track.name} ${track.artists.map((a: any) => a.name).join(" ")}`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${'AIzaSyBS72hqktHFXJj3lHGSBsJIGIX3l22p6TM'}`;

      const response = await fetch(url);
      const json = await response.json();

      if (json.items && json.items.length > 0) {
        setYoutubeVideoId(json.items[0].id.videoId);
      } else {
        setYoutubeVideoId(null);
        setYtError("No YouTube video found");
      }
    } catch (error) {
      console.error("YouTube API fetch error:", error);
      setYtError("Failed to fetch YouTube video");
      setYoutubeVideoId(null);
    } finally {
      setYtLoading(false);
    }
  }, [track]);

  useEffect(() => {
    if (!track.preview_url) {
      fetchYoutubeVideoId();
    }
  }, [track.preview_url, fetchYoutubeVideoId]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const formatMillis = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Image
        source={{ uri: track.album.images[0]?.url }}
        style={styles.albumImage}
        resizeMode="cover"
      />

      <Text style={styles.trackName}>{track.name}</Text>
      <Text style={styles.artists}>{track.artists.map((a: any) => a.name).join(", ")}</Text>
      <Text style={styles.albumName}>Album: {track.album.name}</Text>
      <Text style={styles.releaseDate}>Release Date: {track.album.release_date}</Text>

      {/* Spotify preview audio player */}
      {track.preview_url ? (
        <>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#fff"
            thumbTintColor="#1DB954"
            onSlidingComplete={onSlidingComplete}
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatMillis(position)}</Text>
            <Text style={styles.timeText}>{formatMillis(duration)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.playButton, loading && { opacity: 0.5 }]}
            onPress={togglePlayback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#1DB954" />
            ) : (
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={64}
                color="#1DB954"
              />
            )}
          </TouchableOpacity>
        </>
      ) : ytLoading ? (
        <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 40 }} />
      ) : youtubeVideoId ? (
        <View style={{ marginTop: 20 }}>
          <YoutubePlayer
            height={230}
            width={width * 0.9}
            videoId={youtubeVideoId}
            play={true}
          />
        </View>
      ) : (
        <Text style={styles.noPreview}>
          {ytError || "No preview available"}
        </Text>
      )}
    </View>
  );
};

export default TrackDetails;
