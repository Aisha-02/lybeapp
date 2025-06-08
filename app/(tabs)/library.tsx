import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../styles/LibraryStyles'; // Adjust the import path as necessary

const PlaylistPage = () => {
  const navigation = useNavigation<any>();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const [playlists, setPlaylists] = useState<{ id: string; name?: string; tracks?: any[] }[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, 'users', user.uid, 'playlists'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaylists(data);
    });

    return () => unsub();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
  
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
  
    try {
      await addDoc(collection(db, 'users', user.uid, 'playlists'), {
        name: newPlaylistName,
      });
      setNewPlaylistName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create playlist');
    }
  };
  

  const renderPlaylistItem = ({ item }: { item: { id: string; name?: string } }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => navigation.navigate('Playlists', { playlist: item })}
    >
      <Ionicons name="musical-notes" size={22} color="#fff" />
      <Text style={styles.playlistName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAwareScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
    enableOnAndroid={true}
    enableResetScrollToCoords={false}
    extraScrollHeight={20}
    extraHeight={Platform.OS === 'ios' ? 120 : 0}
    resetScrollToCoords={{ x: 0, y: 0 }}
    >
        <Text style={styles.header}>Your Playlists</Text>

        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No playlists created yet.</Text>}
        />

        <Text style={styles.header}>Liked Songs</Text>
        <TouchableOpacity
          style={styles.likedItem}
          onPress={() => navigation.navigate('Playlists', { isLiked: true })}
        >
          <Ionicons name="heart" size={22} color="#e91e63" />
          <Text style={styles.playlistName}>Liked Songs</Text>
        </TouchableOpacity>

        <View style={styles.createSection}>
          <Text style={styles.subHeader}>Create New Playlist</Text>
          <TextInput
            placeholder="Enter playlist name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePlaylist}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAwareScrollView>
  );
};

export default PlaylistPage;