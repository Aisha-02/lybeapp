import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
  collection,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Colors } from '../constants/Colors';

type Song = {
    id: string;
    name: string;
    album: {
      name?: string;
      images: string;
      release_date?: string;
    };
    artists: string[];
    preview_url?: string | null;
  };
  

const Playlists = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const { isLiked, playlist } = route.params as
    | { isLiked: true; playlist?: never }
    | { isLiked?: never; playlist: { id: string; name: string } };

  const [tracks, setTracks] = useState<Song[]>([]);
  
  useEffect(() => {
   if (!user) return;

   const fetchAndEnrichTracks = async (trackDocs: any[]) => {
    try {
      const enrichedTracks: Song[] = await Promise.all(
        trackDocs.map(async (doc) => {
          const trackData = doc.data ? doc.data() : doc; // if doc is raw object
          return {
            id: trackData.id,
            name: trackData.name || 'Unknown',
            album: trackData.album || { image: 'https://via.placeholder.com/60' },
            artists: trackData.artists || [],
            preview_url: trackData.preview_url || null,
        } as Song;
   })
      );

      setTracks(enrichedTracks); // ✅ <--- This was missing
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch song details');
    }
  };

    if (isLiked) {
      const fetchLikedSongs = async () => {
        try {
          const likedSnap = await getDocs(collection(db, 'users', user.uid, 'likedSongs'));
          await fetchAndEnrichTracks(likedSnap.docs);
        } catch (error) {
          Alert.alert('Error', 'Failed to load liked songs');
        }
      };
      fetchLikedSongs();
    } else if (playlist) {
      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlist.id);
      const unsubscribe = onSnapshot(playlistRef, (docSnap) => {
        if (docSnap.exists()) {
          const rawTracks = docSnap.data().tracks || [];
          fetchAndEnrichTracks(rawTracks.map((t: any) => ({ id: t.id })));
        }
      });

      return () => unsubscribe();
    }
  }, [isLiked, playlist, user]);

  const renderTrack = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => navigation.navigate('TrackDetails', { track: item })}
    >
      <Image
        source={{ uri: item.album.images || 'https://via.placeholder.com/60' }}
        style={styles.albumImage}
      />
      <View style={styles.viewProp}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.artistName}>{item.artists.join(', ')}</Text>
      </View>
      {playlist && (
        <TouchableOpacity onPress={() => removeTrack(index)}>
          <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const removeTrack = async (indexToRemove: number) => {
    if (!playlist || !user) return;
    try {
      const updatedTracks = [...tracks];
      updatedTracks.splice(indexToRemove, 1);

      const playlistRef = doc(db, 'users', user.uid, 'playlists', playlist.id);
      await updateDoc(playlistRef, {
        tracks: updatedTracks.map((track) => ({ id: track.id })), // only save id
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to remove track');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isLiked ? 'Liked Songs' : playlist ? playlist.name : 'Songs'}
      </Text>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderTrack}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No songs found.</Text>
        }
      />
    </View>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  viewProp: {
    marginLeft: 12,
    flex: 1,
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
  },
  artistName: {
    color: '#aaa',
    fontSize: 14,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
