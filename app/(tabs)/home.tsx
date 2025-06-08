import ProfileScreen from '@/screens/userProfile';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  FlatList,
  Image, ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import app from '../../firebaseconfig';
import MenuScreen from '../../screens/userMenu';
import styles from '../../styles/HomeStyles';

const Home = () => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [musicArtists, setmusicArtists] = useState<string[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation<any>();

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const prefDoc = await getDoc(doc(db, 'user_preferences', user.uid));

          if (isMounted) {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserName(userData.username || 'User');
            }

            if (prefDoc.exists()) {
              const prefData = prefDoc.data();
              setProfilePic(prefData.profilePic || 'https://via.placeholder.com/150');
              setmusicArtists(prefData.favSingers || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        Alert.alert('Oops!', 'Failed to load user data.');
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoadingSongs(true);
      setLoadingArtists(true);
      try {
        const artistParams = musicArtists.join(',');

        const [songsRes, artistRes] = await Promise.all([
          fetch(`http://192.168.1.81:3000/api/spotify/recommendations?artists=${artistParams}`),
          fetch(`http://192.168.1.81:3000/api/spotify/artists?artists=${artistParams}`)
        ]);

        const songsData = await songsRes.json();
        const artistsData = await artistRes.json();

        setSongs((songsData?.tracks || []).filter((item: any) => item && (item.track?.id || item.id)));

        let similarArtists: any[] = [];

        if (Array.isArray(artistsData)) {
          similarArtists = artistsData.flatMap((artist: any) => artist.similar || []);
        } else if (artistsData?.similar) {
          similarArtists = artistsData.similar;
        }

        const filteredArtists = similarArtists.filter((artist: any) =>
          artist && artist.id && artist.images?.[0]?.url
        );
        setArtists(filteredArtists);
      } catch (error) {
        console.error('Error fetching personalized music:', error);
        Alert.alert('Oops!', 'Failed to fetch music data.');
      } finally {
        setLoadingSongs(false);
        setLoadingArtists(false);
      }
    };

    if (musicArtists.length > 0) {
      fetchContent();
    }
  }, [musicArtists]);

  const renderSongItem = ({ item, index }: any) => {
    const song = item.track || item;
    if (!song?.album?.images?.[0]) return null;

    return (
      <TouchableOpacity key={`${song.id}-${index}`} style={styles.songCard}
        onPress={() => navigation.navigate('TrackDetails', { track: song })}>
        <Image source={{ uri: song.album.images[0].url }} style={styles.songImage} />
        <Text style={styles.songText} numberOfLines={1}>{song.name}</Text>
        <Text style={styles.songText} numberOfLines={1}>
          {song.artists?.[0]?.name || 'Unknown Artist'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderArtistItem = ({ item }: any) => {
    const artistImage = item.images?.[0]?.url;
    if (!artistImage) return null;

    return (
      <TouchableOpacity
       onPress={() => navigation.navigate("ArtistSongs", { artistId: item.id, artistName: item.name })}
        style={artistCardWrapper}
      >
        <View style={artistCard}>
          <Image
            source={{ uri: artistImage }}
            style={artistImageStyle}
            resizeMode="cover"
          />
          <Text style={artistNameText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.profileContainer}  onPress={() => navigation.navigate(ProfileScreen, { uid: auth.currentUser?.uid })}>
            <Image source={{ uri: profilePic }} style={styles.avatar} />
            <Text style={styles.greeting}>Hi, {userName}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMenu(prev => !prev)}
            style={styles.menuIcon}
            accessible accessibilityLabel="Open Menu"
          >
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎧 Made For You</Text>
          {loadingSongs ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : songs.length > 0 ? (
            <FlatList
              data={songs}
              keyExtractor={(item, index) => `${item?.track?.id || item?.id}-${index}`}
              renderItem={renderSongItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>No songs found</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 Artists You May Like</Text>
          {loadingArtists ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : artists.length > 0 ? (
            <FlatList
              data={artists}
              keyExtractor={(item, index) => `${item?.id}-${index}`}
              renderItem={renderArtistItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>No artists found</Text>
          )}
        </View>
      </ScrollView>

      {showMenu && <MenuScreen onClose={() => setShowMenu(false)} />}
    </View>
    </SafeAreaView>
  );
};

const artistCardWrapper = {
  marginHorizontal: 6,
};

const artistCard = {
  backgroundColor: '#1c1c1e',
  padding: 8,
  borderRadius: 12,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  width: 100,
  height: 140,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 4,
};

const artistImageStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
};

const artistNameText = {
  color: '#fff',
  marginTop: 6,
  fontSize: 12,
};

export default Home;
