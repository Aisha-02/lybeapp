import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import MenuScreen from '../../screens/userMenu';
import styles from '../../styles/HomeStyles';  // Import styles

const Home = () => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [musicLanguages, setMusicLanguages] = useState<string[]>([]);
  const [musicOptions, setMusicOptions] = useState<string[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const prefDoc = await getDoc(doc(db, 'user_preferences', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.username || 'User');
        }

        if (prefDoc.exists()) {
          const prefData = prefDoc.data();
          setProfilePic(prefData.profilePic || 'https://i.imgur.com/placeholder.png');
          setMusicLanguages(prefData.musicLangPref || ['English']);
          setMusicOptions(prefData.musicTaste || ['Pop']);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const genreParams = musicOptions.join(',');

        const songsRes = await fetch(`http://IP ADDRESS:3000/api/spotify/recommendations?genres=${genreParams}`);
        const artistRes = await fetch(`http://IP ADDRESS:3000/api/spotify/artists?genres=${genreParams}`);

        const songsData = await songsRes.json();
        const artistsData = await artistRes.json();

        setSongs(songsData || []);
        setArtists(artistsData || []);
      } catch (error) {
        console.error('Error fetching personalized music:', error);
      }
    };

    if (musicLanguages.length || musicOptions.length) {
      fetchContent();
    }
  }, [musicLanguages, musicOptions]);

  const handleArtistPress = async (artistId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/spotify/artist-tracks/${artistId}`);
      const data = await res.json();
      setSongs(data.songs || []);
    } catch (error) {
      console.error('Error fetching songs for artist:', error);
    }
  };

  const renderSongItem = ({ item }: any) => (
    <View style={styles.songCard}>
      <Image source={{ uri: item.track.album.images[0].url }} style={styles.songImage} />
      <Text style={styles.songText} numberOfLines={1}>{item.track.name}</Text>
      <Text style={styles.songText} numberOfLines={1}>{item.artist}</Text>
    </View>
  );
  
  const renderArtistItem = ({ item }: any) => {
    const artistImage = item.images && item.images[0]?.url;
  
    return (
      <View style={styles.artistCard}>
        {artistImage ? (
          <Image source={{ uri: artistImage }} style={styles.artistImage} />
        ) : (
          <Text style={styles.artistText}>No image</Text>
        )}
        <Text style={styles.artistText} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topBar}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: profilePic }} style={styles.avatar} />
            <Text style={styles.greeting}>Hi, {userName}</Text>
          </View>

          <TouchableOpacity style={styles.chatIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(prev => !prev)} style={styles.menuIcon}>
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎧 Made For You</Text>
          {songs.length > 0 ? (
            <FlatList
              data={songs}
              keyExtractor={(item, index) => item.track.id || index.toString()}
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
          <FlatList
            data={artists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArtistItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {showMenu && <MenuScreen onClose={() => setShowMenu(false)} />}
    </View>
  );
};

export default Home;
