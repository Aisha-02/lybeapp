import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { Colors } from "../constants/Colors";
import { auth, db } from "../firebaseconfig";
import { collection, doc, setDoc } from "firebase/firestore";
import styles from "../styles/TrackDetails";

const PlaylistModal = ({
  visible,
  playlists,
  track,
  deezerPreview,
  onAdded
}: any) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      return Toast.show({
        type: "error",
        text1: "Select a playlist",
      });
    }

    const user = auth.currentUser;
    if (!user) return;

    const songRef = doc(
      collection(db, "users", user.uid, "playlists", selectedPlaylistId, "songs"),
      track.id
    );

    await setDoc(songRef, {
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => a.name),
      album: track.album,
      preview_url: track.preview_url || deezerPreview || null,
      addedAt: new Date(),
    });

    Toast.show({ type: "success", text1: "Song Added" });
    setSelectedPlaylistId(null);
    onAdded();
  };

  const handleCreateAndAdd = async () => {
    const name = newPlaylistName.trim();
    if (!name) {
      return Toast.show({ type: "error", text1: "Enter a name" });
    }

    const user = auth.currentUser;
    if (!user) return;

    // Check duplicates
    const exists = playlists.some(
      (p: any) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return Toast.show({
        type: "error",
        text1: "Name already exists",
      });
    }

    // Create playlist
    const playlistRef = doc(collection(db, "users", user.uid, "playlists"));
    await setDoc(playlistRef, {
      name,
      createdAt: new Date(),
    });

    // Add song
    const songRef = doc(
      collection(db, "users", user.uid, "playlists", playlistRef.id, "songs"),
      track.id
    );

    await setDoc(songRef, {
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => a.name),
      album: track.album,
      preview_url: track.preview_url || deezerPreview || null,
      addedAt: new Date(),
    });

    Toast.show({
      type: "success",
      text1: "Playlist Created",
      text2: "Song added",
    });
    setNewPlaylistName("");
    onAdded();
    // reload playlists in TrackDetails
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onAdded}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Add to Playlist</Text>

          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 300, marginBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.playlistItem,
                  item.id === selectedPlaylistId && styles.selectedPlaylistItem,
                ]}
                onPress={() => setSelectedPlaylistId(item.id)}
              >
                <Text style={styles.playlistItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TextInput
            placeholder="New Playlist Name"
            placeholderTextColor={Colors.placeholder}
            style={styles.playlistInput}
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />

          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.modalActionButton, { flex: 1, marginRight: 8 }]}
              onPress={handleCreateAndAdd}
            >
              <Text style={styles.modalActionButtonText}>Create & Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalActionButton,
                {
                  flex: 1,
                  marginLeft: 8,
                  backgroundColor: selectedPlaylistId
                    ? Colors.buttonBackground
                    : Colors.disabledButton,
                },
              ]}
              disabled={!selectedPlaylistId}
              onPress={handleAddToPlaylist}
            >
              <Text style={styles.modalActionButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PlaylistModal;
