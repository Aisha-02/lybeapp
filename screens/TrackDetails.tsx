import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import styles from "../styles/TrackDetails";
import Toast from "react-native-toast-message";
import { Colors } from "../constants/Colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { auth, db } from "../firebaseconfig";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import PlaylistModal from "@/components/PlaylistModal";

import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

const fallbackImage = "https://via.placeholder.com/500x500.png?text=No+Image";

const TrackDetails = ({ route, navigation }: any) => {
  const { track } = route.params;

  const playbackState = usePlaybackState();
  const { position, duration } = useProgress(200);

  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const [deezerPreview, setDeezerPreview] = useState<string | null>(null);
  const [dzLoading, setDzLoading] = useState(false);

  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Array<any>>([]);

  const albumImage = track.album?.images?.[0]?.url || track.imageUrl || fallbackImage;
  const artistNames = track.artists?.map((a: any) => a.name).join(", ");

  /* -----------------------------
        LOAD LIKE STATUS
  ----------------------------- */
  useEffect(() => {
    const checkIfLiked = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(collection(db, "users", user.uid, "likedSongs"), track.id);
      const snap = await getDoc(ref);
      if (snap.exists()) setLiked(true);
      else setLiked(false);
    };

    checkIfLiked();
  }, [track.id]);

  /* -----------------------------
        DEEZER FALLBACK PREVIEW
  ----------------------------- */
  const fetchDeezerPreview = async () => {
    setDzLoading(true);
    try {
      const query = `${track.name} ${artistNames}`;
      const res = await fetch(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "fab1614458msh3d880265eb3d62dp11a8abjsn8a48344ceb42",
          },
        }
      );

      const json = await res.json();
      if (json?.data?.[0]?.preview) {
        setDeezerPreview(json.data[0].preview);
      }
    } catch (err) {
      console.log("Deezer fetch error:", err);
    }
    setDzLoading(false);
  };

  useEffect(() => {
    if (!track.preview_url) fetchDeezerPreview();
  }, [track.id]);

  /* -----------------------------
      LOAD NEW TRACK ON SCREEN OPEN
  ----------------------------- */
  useEffect(() => {
    const loadTrack = async () => {
      try {
        await TrackPlayer.reset();

        await TrackPlayer.add({
          id: track.id,
          url: track.preview_url || deezerPreview,
          title: track.name,
          artist: artistNames,
          artwork: albumImage,
        });
      } catch (e) {
        console.log("Track load error:", e);
      }
    };

    loadTrack();
  }, [track.id, deezerPreview]);

  /* -----------------------------
          PLAY / PAUSE
  ----------------------------- */
  const togglePlayback = async () => {
    try {
      const state = await TrackPlayer.getPlaybackState();

      if (state.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (err) {
      console.log("toggle error:", err);
    }
  };

  /* -----------------------------
          SEEK / VOLUME
  ----------------------------- */
  const onSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const onVolumeChange = async (v: number) => {
    setVolume(v);
    await TrackPlayer.setVolume(v);
  };

  /* -----------------------------
          LIKE / UNLIKE
  ----------------------------- */
  const handleLikeToggle = async () => {
    const user = auth.currentUser;
    if (!user)
      return Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please log in first.",
      });

    const ref = doc(collection(db, "users", user.uid, "likedSongs"), track.id);

    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await deleteDoc(ref);
        setLiked(false);
      } else {
        await setDoc(ref, {
          id: track.id,
          name: track.name,
          artists: track.artists?.map((a: any) => a.name),
          preview_url: track.preview_url || deezerPreview,
          likedAt: new Date(),
        });
        setLiked(true);
      }
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  /* -----------------------------
        PLAYLIST MODAL
  ----------------------------- */
  const loadPlaylists = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDocs(collection(db, "users", user.uid, "playlists"));
    setUserPlaylists(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const openPlaylistModal = () => {
    loadPlaylists();
    setPlaylistModalVisible(true);
  };

  /* -----------------------------
              UI
  ----------------------------- */
  const isPlaying = playbackState.state === State.Playing;
  const formatTime = (sec: number) => {
    const s = Math.floor(sec || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <ImageBackground source={{ uri: albumImage }} style={styles.bg} blurRadius={20}>
      <View style={styles.overlay}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={Colors.trackicons} />
        </TouchableOpacity>

        {/* Album Art */}
        <Image source={{ uri: albumImage }} style={styles.albumImage} />

        {/* Title */}
        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.artists}>{artistNames}</Text>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor={Colors.minTrackTint}
            maximumTrackTintColor={Colors.maxTrackTint}
            thumbTintColor={Colors.thumbTint}
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Like */}
          <TouchableOpacity onPress={handleLikeToggle}>
            <AntDesign
              name={liked ? "heart" : "hearto"}
              size={28}
              color={Colors.trackicons}
            />
          </TouchableOpacity>

          {/* Play Pause */}
          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={70}
              color={Colors.loading}
            />
          </TouchableOpacity>

          {/* Volume */}
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

        {/* Playlist Modal Trigger */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={openPlaylistModal}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.trackicons} />
            <Text style={styles.buttonText}>Add to Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Home", { screen: "Connect", params: { track } })} >
            <Ionicons name="send" size={24} color={Colors.trackicons} />
            <Text style={styles.buttonText}>Dedicate</Text>
          </TouchableOpacity>
        </View>

        {/* Deezer Loading */}
        {!track.preview_url && dzLoading && (
          <ActivityIndicator size="large" color={Colors.loading} />
        )}

        {!track.preview_url && !deezerPreview && !dzLoading && (
          <Text style={styles.noPreview}>No preview available</Text>
        )}

        {/* Playlist Modal */}
        <PlaylistModal
          visible={playlistModalVisible}
          playlists={userPlaylists}
          track={track}
          deezerPreview={deezerPreview}
          onRefresh={loadPlaylists}
          onAdded={() => setPlaylistModalVisible(false)}
        />
      </View>
    </ImageBackground>
  );
};

export default TrackDetails;
