import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { styles } from '../styles/ProfileStyles';
import app from '../firebaseconfig';

const genreIcons: any = {
  Bollywood: 'movie',
  Indie: 'music-note',
  'Hip-Hop': 'mic',
  'Lo-Fi': 'headset',
  Pop: 'music-note',
  Rock: 'audiotrack',
  Sufi: 'library-music',
  Classical: 'queue-music',
};

interface ProfileType {
  username: string;
  bio: string;
  birthday: any;
  pronouns: string;
  currentVibe: string;
  idealConnection: string;
  relationshipStatus: string;
  musicTaste: string[];
  favSingers: string[];
  profilePic: string;
}


const ProfileScreen = ({ route }: any) => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigation = useNavigation();
  const userId = route.params?.uid || auth.currentUser?.uid;
  const isOwnProfile = auth.currentUser?.uid === userId;

  const [profileData, setProfileData] = useState<ProfileType>({
    username: '',
    bio: '',
    birthday: '',
    pronouns: '',
    currentVibe: '',
    idealConnection: '',
    relationshipStatus: '',
    musicTaste: [],
    favSingers: [],
    profilePic: '',
  });
  const [favArtistsWithImages, setFavArtistsWithImages] = useState<any[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const prefRef = doc(db, 'user_preferences', userId);
      const userRef = doc(db, 'users', userId);

      const [prefSnap, userSnap] = await Promise.all([
        getDoc(prefRef),
        getDoc(userRef),
      ]);

      const profile = prefSnap.exists() ? prefSnap.data() : {};
      const user = userSnap.exists() ? userSnap.data() : {};

      const updated = {
        username: user.username || 'User',
        bio: profile.bio || '',
        birthday: profile.birthday || '',
        pronouns: profile.pronouns || '',
        currentVibe: profile.currentVibe || '',
        idealConnection: profile.idealConnection || '',
        relationshipStatus: profile.relationshipStatus || '',
        musicTaste: profile.musicTaste || [],
        favSingers: profile.favSingers || [],
        profilePic: profile.profilePic || '',
      };
  
      setProfileData(updated);
      setLoading(false);
    };
  
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (profileData.favSingers.length > 0) {
      fetchFavArtistsWithImages(profileData.favSingers);
    }
  }, [profileData.favSingers]);
  
  // Fetch artist images
  const fetchFavArtistsWithImages = async (favArtists: string[]) => {
    const results: any[] = [];

    for (const name of favArtists) {
      try {
        const res = await fetch(
          `https://music-app-1-zb1y.onrender.com/api/spotify/artist-image?artistName=${name}`
        );
        if (!res.ok) {
          results.push({ name, image: null });
          continue;
        }

        const data = await res.json(); // { image }
        results.push({ name, image: data.image || null });
      } catch (err) {
        console.log('Image fetch error:', err);
        results.push({ name, image: null });
      }
    }

    setFavArtistsWithImages(results);
  };

  const handleSave = async () => {
    const updatedData = { ...profileData };

    // Convert birthday string → Date
    if (typeof updatedData.birthday === 'string') {
      const parts = updatedData.birthday.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        updatedData.birthday = new Date(year, month - 1, day);
      }
    }

    await updateDoc(doc(db, 'user_preferences', userId), updatedData);
    setIsEditable(false);
  };

  const calculateAge = (birthday: any) => {
    if (!birthday?.toDate) return '';
    const birth = birthday.toDate();
    const diff = Date.now() - birth.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const renderGenreIcons = (genres: string[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
      {genres.map((genre, idx) => (
        <View key={idx} style={styles.genreChip}>
          <MaterialIcons
            name={genreIcons[genre]}
            size={20}
            color={Colors.buttonBackground}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.genreChipText}>{genre}</Text>
        </View>
      ))}
    </ScrollView>
  );

  // Render Fav Artists with image
  const renderArtistIcons = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
      {favArtistsWithImages.map((artist, index) => (
        <View key={index} style={{ alignItems: 'center', marginRight: 15 }}>
          {artist.image ? (
            <Image
              source={{ uri: artist.image }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                marginBottom: 5,
              }}
            />
          ) : (
            <MaterialIcons name="person" size={50} color={Colors.buttonBackground} />
          )}
          <Text style={[styles.genreChipText, { width: 70, textAlign: 'center', color: Colors.artist }]} numberOfLines={1}>
            {artist.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  if (loading || !profileData)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profileData.username}</Text>
      </View>

      {/* Profile Picture */}
      <ImageBackground
        source={{ uri: profileData.profilePic }}
        style={styles.dp}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        >
          <Text style={styles.nameOverlayText}>
            {profileData.username}, {calculateAge(profileData.birthday)}
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Edit Button */}
      {isOwnProfile && (
        <TouchableOpacity
          onPress={() => (isEditable ? handleSave() : setIsEditable(true))}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditable ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      )}

      {/* View Mode */}
      {!isEditable ? (
        <>
          <Text style={styles.sectionTitle}>Current Vibe</Text>
          <Text style={styles.vibeText}>{profileData.currentVibe}</Text>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{profileData.bio}</Text>

          <Text style={styles.sectionTitle}>Music Taste</Text>
          {renderGenreIcons(profileData.musicTaste || [])}

          <Text style={styles.sectionTitle}>Looking For</Text>
          <Text style={styles.bioText}>{profileData.idealConnection}</Text>

          <Text style={styles.sectionTitle}>Relationship Status</Text>
          <Text style={styles.bioText}>{profileData.relationshipStatus}</Text>

          <Text style={styles.sectionTitle}>Favourite Artists</Text>
          {renderArtistIcons()}
        </>
      ) : (
        /* Edit Mode */
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            value={profileData.bio}
            onChangeText={(t) => setProfileData({ ...profileData, bio: t })}
          />

          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            value={
              profileData.birthday?.toDate
                ? profileData.birthday.toDate().toISOString().substring(0, 10)
                : profileData.birthday
            }
            onChangeText={(t) => setProfileData({ ...profileData, birthday: t })}
          />

          <Text style={styles.label}>Pronouns</Text>
          <TextInput
            style={styles.input}
            value={profileData.pronouns}
            onChangeText={(t) => setProfileData({ ...profileData, pronouns: t })}
          />

          <Text style={styles.label}>Current Vibe</Text>
          <TextInput
            style={styles.input}
            value={profileData.currentVibe}
            onChangeText={(t) => setProfileData({ ...profileData, currentVibe: t })}
          />

          <Text style={styles.label}>Looking For</Text>
          <TextInput
            style={styles.input}
            value={profileData.idealConnection}
            onChangeText={(t) =>
              setProfileData({ ...profileData, idealConnection: t })
            }
          />

          <Text style={styles.label}>Relationship Status</Text>
          <TextInput
            style={styles.input}
            value={profileData.relationshipStatus}
            onChangeText={(t) =>
              setProfileData({ ...profileData, relationshipStatus: t })
            }
          />

          <Text style={styles.label}>Fav Artists</Text>
          <TextInput
            style={styles.input}
            value={(profileData.favSingers || []).join(', ')}
            onChangeText={(text) =>
              setProfileData({
                ...profileData,
                favSingers: text.split(',').map((s) => s.trim()),
              })
            }
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;