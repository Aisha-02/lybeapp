import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import styles from "../styles/TrackDetails";
import Toast from "react-native-toast-message";
import { Colors } from "../constants/Colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { auth, db } from "../firebaseconfig";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import PlaylistModal from "@/components/PlaylistModal";

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

  // Playlist states
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Array<any>>([]);


  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const checkIfLiked = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const likedRef = doc(collection(db, "users", user.uid, "likedSongs"), track.id);
      const docSnap = await getDoc(likedRef);
      if (docSnap.exists()) setLiked(true);
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
      if (data?.data?.[0]?.preview) setDeezerPreview(data.data[0].preview);
    } catch (err) {
      console.error("Deezer fetch error:", err);
    } finally {
      setDzLoading(false);
    }
  }, [track]);

  const handleLikeToggle = async () => {
    const user = auth.currentUser;
    if (!user)
      return Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in first.",
      });

    const likedRef = doc(collection(db, "users", user.uid, "likedSongs"), track.id);

    try {
      const docSnap = await getDoc(likedRef);
      if (docSnap.exists()) {
        await deleteDoc(likedRef);
        setLiked(false);
      } else {
        await setDoc(likedRef, {
          id: track.id,
          name: track.name,
          artists: track.artists?.map((a: any) => a.name),
          album: {
            name: track.album?.name,
            images: track.album?.images || [{ url: fallbackImage }],
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
      if (status.isLoaded) setDuration(status.durationMillis || 0);
    } catch {
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
      if ("isPlaying" in status && status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const onSlidingComplete = async (value: number) => {
    if (soundRef.current) await soundRef.current.setPositionAsync(value);
  };

  const onVolumeChange = async (value: number) => {
    setVolume(value);
    if (soundRef.current) await soundRef.current.setVolumeAsync(value);
  };

  const formatMillis = (millis: number) => {
    const total = Math.floor(millis / 1000);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (!track.preview_url) fetchDeezerPreview();
  }, [track.preview_url]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const albumImage = track.album?.images?.[0]?.url || fallbackImage;
  const artistNames = Array.isArray(track.artists)
    ? track.artists.map((a: any) => (typeof a === "string" ? a : a.name)).join(", ")
    : "Unknown";

  const loadPlaylists = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await getDocs(collection(db, "users", user.uid, "playlists"));

    const list = snapshot.docs.map((d) => ({
      id: d.id,
      name: d.data().name,
      createdAt: d.data().createdAt,
    }));

    setUserPlaylists([...list]);   // ⭐ ensure new array reference
  };

  // open modal
  const openPlaylistModal = () => {
    loadPlaylists();
    setPlaylistModalVisible(true);
  };

  const handleSongAdded = () => {
    loadPlaylists();     // refresh playlists
    setPlaylistModalVisible(false); // close modal
  }

  return (
    <ImageBackground source={{ uri: albumImage }} style={styles.bg} blurRadius={20}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.trackicons} />
        </TouchableOpacity>

        <Image source={{ uri: albumImage }} style={styles.albumImage} />

        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.artists}>{artistNames}</Text>

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
            <AntDesign name={liked ? "heart" : "hearto"} size={28} color={Colors.trackicons} />
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
            <Ionicons name="volume-low" size={20} color={Colors.trackicons} />
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
            <Ionicons name="volume-high" size={20} color={Colors.trackicons} />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={openPlaylistModal}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.trackicons} />
            <Text style={styles.buttonText}>Add to Playlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "Connect",
                params: { track },
              })
            }
          >
            <Ionicons name="send" size={24} color={Colors.trackicons} />
            <Text style={styles.buttonText}>Dedicate</Text>
          </TouchableOpacity>
        </View>

        {!track.preview_url && dzLoading && (
          <ActivityIndicator size="large" color={Colors.loading} style={styles.activityIndicator} />
        )}

        {!track.preview_url && !deezerPreview && !dzLoading && (
          <Text style={styles.noPreview}>No preview available</Text>
        )}
        <PlaylistModal
          visible={playlistModalVisible}
          playlists={userPlaylists}
          track={track}
          deezerPreview={deezerPreview}
          onRefresh={loadPlaylists}
          onAdded={handleSongAdded}
        />

      </View>
    </ImageBackground>
  );
};

export default TrackDetails;
