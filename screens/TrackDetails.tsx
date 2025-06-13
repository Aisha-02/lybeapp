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
import { Colors } from '../constants/Colors';
import { Ionicons , AntDesign } from '@expo/vector-icons';
import { auth, db } from '../firebaseconfig';
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';

// constants
const fallbackImage = "https://via.placeholder.com/500x500.png?text=No+Image";

// main component
const TrackDetails = ({ route, navigation }: any) => {
  const { track } = route.params;

  // State Variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const [deezerPreview, setDeezerPreview] = useState<string | null>(null);
  const [dzLoading, setDzLoading] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
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
      const response = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          "x-rapidapi-key": "fab1614458msh3d880265eb3d62dp11a8abjsn8a48344ceb42",
        },
      });
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
    if (!user) return Alert.alert("Please log in to like songs");

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
            images: track.album?.images || [{ url: 'https://via.placeholder.com/60' }],
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
      if ('isPlaying' in status && status.isPlaying) {
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
    return () => { soundRef.current?.unloadAsync() };
  }, []);

  const albumImage = track.album?.images?.[0]?.url || track.album?.images || fallbackImage;
  const artistNames = Array.isArray(track.artists)
    ? typeof track.artists[0] === 'string'
      ? track.artists.join(', ')
      : track.artists.map((a: any) => a.name).join(', ')
    : 'Unknown Artist';

  const openPlaylistModal = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Please log in first");
    try {
      const playlistSnapshot = await getDocs(collection(db, "users", user.uid, "playlists"));
      const playlists: any[] = [];
      playlistSnapshot.forEach((doc) => playlists.push({ id: doc.id, ...doc.data() }));
      setUserPlaylists(playlists);
      setSelectedPlaylistId(null);
      setNewPlaylistName("");
      setPlaylistModalVisible(true);
    } catch (err) {
      console.error("Error fetching playlists", err);
    }
  };
  const closePlaylistModal = () => {
    setPlaylistModalVisible(false);
    setSelectedPlaylistId(null);
    setNewPlaylistName("");
  };

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
  };
  
  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) return Alert.alert("Please select a playlist");
    const user = auth.currentUser;
    if (!user) return Alert.alert("Please log in first");

    const trackData = {
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => a.name),
      album: {
        name: track.album?.name,
        images: track.album?.images || [{ url: 'https://via.placeholder.com/60' }],
        release_date: track.album?.release_date,
      },
      preview_url: track.preview_url || deezerPreview || null,
      likedAt: new Date(),
    };
    
    if (!trackData.id) {
      console.error('Track ID is missing, not saving to Firestore.');
      return;
    }
    
    await setDoc(
      doc(db, "users", user.uid, "playlists", selectedPlaylistId, "songs", trackData.id),
      trackData
    );
  };

  const handleCreatePlaylistAndAdd = async () => {
    if (!newPlaylistName.trim()) return Alert.alert("Please enter a playlist name");
    const user = auth.currentUser;
    if (!user) return Alert.alert("Please log in first");

    try {
      const playlistRef = doc(collection(db, "users", user.uid, "playlists"));
      await setDoc(playlistRef, {
        name: newPlaylistName.trim(),
        createdAt: new Date(),
      });
      setSelectedPlaylistId(playlistRef.id);
      setNewPlaylistName("");
      // Add track to newly created playlist
      await handleAddToPlaylist();
    } catch (err) {
      console.error("Create playlist error:", err);
    }
  };

  return (
    <ImageBackground source={{ uri: albumImage }} style={styles.bg} blurRadius={20}>
      <View style={styles.overlay}>
        {/* Back & Image */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.iconActive} />
        </TouchableOpacity>
        <Image source={{ uri: albumImage }} style={styles.albumImage} />

        {/* Track Info */}
        <Text style={styles.trackName} numberOfLines={1}>{track.name || "Unknown Title"}</Text>
        <Text style={styles.artists}>{artistNames}</Text>
        <Text style={styles.albumInfo}>Album: {track.album?.name || "N/A"}</Text>
        <Text style={styles.albumInfo}>Release: {track.album?.release_date || "Unknown"}</Text>

        {/* Slider */}
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

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleLikeToggle}>
            <AntDesign name={liked ? "heart" : "hearto"} size={28} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.playButton, loading && { opacity: 0.5 }]} onPress={togglePlayback} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.loading} />
            ) : (
              <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={64} color={Colors.loading} />
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={openPlaylistModal}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.iconActive} />
            <Text style={styles.buttonText}>Add to Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Home', { screen: 'Connect' , params: { track: track }})}>
            <Ionicons name="send" size={24} color={Colors.iconActive} />
            <Text style={styles.buttonText}>Dedicate</Text>
          </TouchableOpacity>
        </View>

        {/* Fallback */}
        {!track.preview_url && dzLoading && <ActivityIndicator size="large" color={Colors.loading} style={styles.activityIndicator} />}
        {!track.preview_url && !deezerPreview && !dzLoading && <Text style={styles.noPreview}>No preview available</Text>}

        {/* Playlist Modal */}
        <Modal transparent visible={playlistModalVisible} animationType="fade" onRequestClose={closePlaylistModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closePlaylistModal}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Add to Playlist</Text>

              <FlatList
                data={userPlaylists}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 300, marginBottom: 16 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.playlistItem,
                      item.id === selectedPlaylistId && styles.selectedPlaylistItem,
                    ]}
                    onPress={() => handleSelectPlaylist(item.id)}
                  >
                    <Text style={styles.playlistItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TextInput
                placeholder="New Playlist Name"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                style={styles.playlistInput}
                placeholderTextColor={Colors.placeholder}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.modalActionButton, { flex: 1, marginRight: 8 }]}
                  onPress={handleCreatePlaylistAndAdd}
                  disabled={!newPlaylistName.trim()}
                >
                  <Text style={styles.modalActionButtonText}>Create & Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionButton, { flex: 1, marginLeft: 8, backgroundColor: selectedPlaylistId ? Colors.buttonBackground : Colors.disabledButton }]}
                  onPress={handleAddToPlaylist}
                  disabled={!selectedPlaylistId}
                >
                  <Text style={styles.modalActionButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default TrackDetails;
