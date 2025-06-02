import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import styles from "../styles/TrackDetails";
import { Colors } from '../constants/Colors';
import { auth, db } from '../firebaseconfig'; // Adjust the import path as needed
import { doc, collection, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
const fallbackImage = "https://via.placeholder.com/500x500.png?text=No+Image";

const TrackDetails = ({ route, navigation }: any) => {
  const { track } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const [deezerPreview, setDeezerPreview] = useState<string | null>(null);
  const [dzLoading, setDzLoading] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const checkIfLiked = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const likedRef = doc(collection(db, "users", userId, "likedSongs"), track.id);
      const docSnap = await getDoc(likedRef);
      if (docSnap.exists()) {
        setLiked(true);
      }
    };

    checkIfLiked();
  }, [track.id]);

  const fetchDeezerPreview = useCallback(async () => {
    setDzLoading(true);
    try {
      const query = `${track.name} ${track.artists?.map((a: any) => a.name).join(" ")}`;
      const response = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "fab1614458msh3d880265eb3d62dp11a8abjsn8a48344ceb42",
          },
        }
      );
      const data = await response.json();
      if (data?.data?.[0]?.preview) {
        setDeezerPreview(data.data[0].preview);
      } else {
        setDeezerPreview(null);
      }
    } catch (err) {
      console.error("Deezer fetch error:", err);
      setDeezerPreview(null);
    } finally {
      setDzLoading(false);
    }
  }, [track]);

  const handleLikeToggle = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Please log in to like songs");
      return;
    }

    const userId = user.uid;
    const likedRef = doc(collection(db, "users", userId, "likedSongs"), track.id);

    try {
      const docSnap = await getDoc(likedRef);

      if (docSnap.exists()) {
        // Song is already liked → unlike it
        await deleteDoc(likedRef);
        setLiked(false);
      } else {
        // Song is not liked → like it
        await setDoc(likedRef, {
          id: track.id,
          name: track.name,
          artists: track.artists?.map((a: any) => a.name),
          album: {
            name: track.album?.name,
            images: track.album?.images?.[0]?.url,
            release_date: track.album?.release_date,
          },
          preview_url: track.preview_url || deezerPreview || null,
          likedAt: new Date(),
        });
        setLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const loadAudio = async (url: string) => {
    setLoading(true);
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true);
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (err) {
      Alert.alert("Audio Error", "Failed to load audio preview.");
    } finally {
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis);
    setDuration(status.durationMillis || 0);
    if (status.didJustFinish) {
      setIsPlaying(false);
      soundRef.current?.setPositionAsync(0);
    }
  };

  const togglePlayback = async () => {
    const url = track.preview_url || deezerPreview;
    if (!url) return;

    if (!soundRef.current) {
      await loadAudio(url);
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

  const onSlidingComplete = async (value: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value);
  };

  const onVolumeChange = async (value: number) => {
    setVolume(value);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(value);
    }
  };

  const formatMillis = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (!track.preview_url) {
      fetchDeezerPreview();
    }
  }, [track.preview_url, fetchDeezerPreview]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const albumImage = track.album?.images?.[0]?.url ||  track.album?.images || fallbackImage ;
  const artistNames = Array.isArray(track.artists)
  ? typeof track.artists[0] === 'string'
    ? track.artists.join(', ')
    : track.artists.map((a: any) => a.name).join(', ')
  : 'Unknown Artist';

  return (
    <ImageBackground source={{ uri: albumImage }} style={styles.bg} blurRadius={20}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.iconActive} />
        </TouchableOpacity>

        <Image source={{ uri: albumImage }} style={styles.albumImage} />

        <Text style={styles.trackName} numberOfLines={1}>
          {track.name || "Unknown Title"}
        </Text>
        <Text style={styles.artists}>{artistNames}</Text>
        <Text style={styles.albumInfo}>Album: {track.album?.name || "N/A"}</Text>
        <Text style={styles.albumInfo}>
          Release: {track.album?.release_date || "Unknown"}
        </Text>

        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor={Colors.minTrackTint}
            maximumTrackTintColor={Colors.maxTrackTint}
            thumbTintColor={Colors.thumbTint}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatMillis(position)}</Text>
            <Text style={styles.timeText}>{formatMillis(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handleLikeToggle}>
            <AntDesign name={liked ? "heart" : "hearto"} size={28} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, loading && { opacity: 0.5 }]}
            onPress={togglePlayback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.loading} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={64}
                color={Colors.loading}
              />
            )}
          </TouchableOpacity>

          <View style={styles.volumeControl}>
            <Ionicons name="volume-low" size={20} color={Colors.iconActive} />
            <Slider
              style={styles.slider2}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
              value={volume}
              onValueChange={onVolumeChange}
              minimumTrackTintColor={Colors.minTrackTint}
              maximumTrackTintColor={Colors.maxTrackTint}
              thumbTintColor={Colors.thumbTint}
            />
            <Ionicons name="volume-high" size={20} color={Colors.iconActive} />
          </View>
        </View>

        {!track.preview_url && dzLoading && (
          <ActivityIndicator size="large" color={Colors.loading} style={styles.activityIndicator} />
        )}
        {!track.preview_url && !deezerPreview && !dzLoading && (
          <Text style={styles.noPreview}>No preview available</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default TrackDetails;
