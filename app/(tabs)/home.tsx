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
import { Colors } from '../../constants/Colors';
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
          fetch(`https://music-app-1-zb1y.onrender.com/api/spotify/recommendations?artists=${artistParams}`),
          fetch(`https://music-app-1-zb1y.onrender.com/api/spotify/artists?artists=${artistParams}`)
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
        style={styles.artistCardWrapper}
      >
        <View style={styles.artistCard}>
          <Image
            source={{ uri: artistImage }}
            style={styles.artistImageStyle}
            resizeMode="cover"
          />
          <Text style={styles.artistNameText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.profileContainer}  onPress={() => navigation.navigate(ProfileScreen, { uid: auth.currentUser?.uid })}>
            <Image source={{ uri: profilePic }} style={styles.avatar} />
            <Text style={[styles.greeting, { color: Colors.text }]}>Hi, {userName}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatIcon} onPress={() => navigation.navigate('notification')}>
            <Ionicons name="notifications-outline" size={28} color={Colors.iconActive} />
          </TouchableOpacity>
       
          <TouchableOpacity style={styles.chatIcon} onPress={() => navigation.navigate('messages')} >
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={Colors.iconActive} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMenu(prev => !prev)}
            style={styles.menuIcon}
            accessible accessibilityLabel="Open Menu"
          >
            <Ionicons name="menu" size={30} color={Colors.iconActive} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>🎧 Made For You</Text>
          {loadingSongs ? (
            <ActivityIndicator size="small" color={Colors.buttonBackground} />
          ) : songs.length > 0 ? (
            <FlatList
              data={songs}
              keyExtractor={(item, index) => `${item?.track?.id || item?.id}-${index}`}
              renderItem={renderSongItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={[styles.noDataText, { color: Colors.subText }]}>No songs found</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>🎤 Artists You May Like</Text>
          {loadingArtists ? (
            <ActivityIndicator size="small" color={Colors.buttonBackground} />
          ) : artists.length > 0 ? (
            <FlatList
              data={artists}
              keyExtractor={(item, index) => `${item?.id}-${index}`}
              renderItem={renderArtistItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={[styles.noDataText, { color: Colors.subText }]}>No artists found</Text>
          )}
        </View>
      </ScrollView>

      {showMenu && <MenuScreen onClose={() => setShowMenu(false)} />}
    </View>
  );
};

export default Home;
