import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import app from '../../firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import MenuScreen from '../../screens/userMenu';

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
          setMusicLanguages(prefData. musicLangPref || ['English']);
          setMusicOptions(prefData.musicTaste || ['Pop']);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      const songResults: any[] = [];
      const artistSet = new Map();
  
      const queries = [...musicLanguages, ...musicOptions];
  
      for (const term of musicOptions) {
        try {
          // Fetch songs
          const songRes = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(term)}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': 'fab1614458msh3d880265eb3d62dp11a8abjsn8a48344ceb42',
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
          });
          const data = await songRes.json();

          if (data && Array.isArray(data.data)) {
            // Fix 1: Push up to 2 songs from each result
            songResults.push(...data.data);
  
            // Fix 2: Collect artists (but limit total to 6)
            for (const song of data.data) {
              if (artistSet.size >= 6) break;
  
              const artist = song.artist;
              if (artist && !artistSet.has(artist.id)) {
                artistSet.set(artist.id, artist);
              }
            }
          } else {
            console.warn(`No valid data returned for term "${term}"`);
          }
  
        } catch (error) {
          console.error(`Error fetching for term "${term}":`, error);
        }
      }
  
      setSongs(songResults); // This should now be populated
      setArtists(Array.from(artistSet.values())); // Limited to 6 artists
    };
  
    if (musicLanguages.length > 0 || musicOptions.length > 0) {
      fetchContent();
    }
  }, [musicLanguages, musicOptions]);
  

  const handleArtistPress = async (artistName: string) => {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&limit=10`);
    const data = await res.json();
    setSongs(data.results);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: profilePic }} style={styles.avatar} />
            <Text style={styles.greeting}>Hi, {userName}</Text>
          </View>

          <TouchableOpacity style={styles.chatIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(prev => !prev)} style={{ padding: 10 }}>
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Personalized Songs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎧 Made For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {songs.map(song => (
              <View key={song.trackId} style={styles.songCard}>
                <Image source={{ uri: song.artworkUrl100 }} style={styles.songImage} />
                <Text style={styles.songText}>{song.trackName}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Artist Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 Artists You May Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {artists.map(artist => (
              <TouchableOpacity key={artist.artistId} onPress={() => handleArtistPress(artist.artistName)} style={styles.artistCard}>
                <Ionicons name="person-circle-outline" size={48} color="#aaa" />
                <Text style={styles.artistText}>{artist.artistName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {showMenu && (
        <MenuScreen onClose={() => setShowMenu(false)} />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  chatIcon: {
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  songCard: {
    marginRight: 10,
    width: 120,
  },
  songImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  songText: {
    color: '#ccc',
    marginTop: 5,
    fontSize: 14,
  },
  artistCard: {
    alignItems: 'center',
    marginRight: 15,
  },
  artistText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});
