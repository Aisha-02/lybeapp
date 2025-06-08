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
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type Song = {
  id: string;
  name: string;
  album: {
    name?: string;
    images: any;
    release_date?: string;
  };
  artists: string[];
  preview_url?: string | null;
};

const Playlists = () => {
  const route = useRoute<any>();
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
            const trackData = doc.data ? doc.data() : doc;
            return {
              id: trackData.id,
              name: trackData.name || 'Unknown',
              album: trackData.album || { images: 'https://via.placeholder.com/60' },
              artists: trackData.artists || [],
              preview_url: trackData.preview_url || null,
            } as Song;
          })
        );
        setTracks(enrichedTracks);
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
      const playlistSongsRef = collection(
        db,
        'users',
        user.uid,
        'playlists',
        playlist.id,
        'songs'
      );

      const unsubscribe = onSnapshot(playlistSongsRef, async (snapshot) => {
        const tracksData = snapshot.docs.map((doc) => doc.data());
        await fetchAndEnrichTracks(tracksData);
      });

      return () => unsubscribe();
    }
  }, [isLiked, playlist, user]);

  const removeTrack = async (trackId: string) => {
    if (!playlist || !user) return;

    try {
      const trackRef = doc(
        db,
        'users',
        user.uid,
        'playlists',
        playlist.id,
        'songs',
        trackId
      );
      await deleteDoc(trackRef);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove track');
    }
  };

  const renderTrack = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => navigation.navigate('TrackDetails', { track: item })}
    >
      <Image
        source={{
          uri:
            typeof item.album.images === 'string'
              ? item.album.images
              : item.album.images[0]?.url || 'https://via.placeholder.com/60',
        }}
        style={styles.albumImage}
      />
      <View style={styles.viewProp}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.artistName}>{item.artists.join(', ')}</Text>
      </View>
      {playlist && (
        <TouchableOpacity onPress={() => removeTrack(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isLiked ? 'Liked Songs' : playlist ? playlist.name : 'Songs'}
      </Text>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderTrack}
        ListEmptyComponent={<Text style={styles.emptyText}>No songs found.</Text>}
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
