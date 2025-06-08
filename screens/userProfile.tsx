import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
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

const ProfileScreen = ({ route }: any) => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigation = useNavigation();
  const userId = route.params?.uid || auth.currentUser?.uid;
  const isOwnProfile = auth.currentUser?.uid === userId;

  const [profileData, setProfileData] = useState<any>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const preferencesRef = doc(db, 'user_preferences', userId);
      const usersRef = doc(db, 'users', userId);

      const [prefSnap, userSnap] = await Promise.all([
        getDoc(preferencesRef),
        getDoc(usersRef),
      ]);

      const profile = prefSnap.exists() ? prefSnap.data() : {};
      const user = userSnap.exists() ? userSnap.data() : {};

      setProfileData({ ...profile, username: user.username || 'User' });
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    const updatedData = { ...profileData };

    if (typeof updatedData.birthday === 'string') {
      const dateParts = updatedData.birthday.split('-');
      if (dateParts.length === 3) {
        const [year, month, day] = dateParts.map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) {
          updatedData.birthday = parsedDate;
        }
      }
    }

    await updateDoc(doc(db, 'user_preferences', userId), updatedData);
    setProfileData(updatedData);
    setIsEditable(false);
  };

  const calculateAge = (birthday: any) => {
    if (!birthday?.toDate) return '';
    const birthDate = birthday.toDate();
    const ageDiff = Date.now() - birthDate.getTime();
    const age = new Date(ageDiff).getUTCFullYear() - 1970;
    return age;
  };

const renderGenreIcons = (genres: string[]) => (
  <View style={styles.genreWrapper}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {genres.map((genre, index) => (
        <View key={index} style={styles.genreCircleWrapper}>
          <View style={styles.genreCircle}>
            <MaterialIcons
              name={genreIcons[genre]}
              size={28}
              color={Colors.buttonBackground}
              style={styles.genreVectorIcon}
            />
          </View>
          <Text style={styles.genreText}>{genre}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);



  const renderArtistIcons = (artists: string[]) => (
    <View style={styles.genreContainer}>
      {artists.map((artist, index) => (
        <View key={index} style={styles.genreIconWrapper}>
          <MaterialIcons name="person" size={40} color={Colors.buttonBackground} />
          <Text style={styles.genreText}>{artist}</Text>
        </View>
      ))}
    </View>
  );

  if (loading || !profileData)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.buttonBackground}/>
        </TouchableOpacity>
        <Text style={styles.userIdText}>{userId}</Text>
      </View>

      {/* Profile Picture with overlayed name, age (pronouns) and gradient blur */}
      <ImageBackground
        source={{ uri: profileData.profilePic }}
        style={styles.dp}
        imageStyle={{ borderRadius: 15 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        >
          <Text style={styles.nameOverlayText}>
            {profileData.username}, {calculateAge(profileData.birthday)}{' '}
            {profileData.pronouns ? `(${profileData.pronouns})` : ''}
          </Text>
        </LinearGradient>
      </ImageBackground>

      {isOwnProfile && (
        <TouchableOpacity
          onPress={() => (isEditable ? handleSave() : setIsEditable(true))}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditable ? 'Save' : 'Edit / Connect'}
          </Text>
        </TouchableOpacity>
      )}

      {!isEditable ? (
        <View style={styles.viewModeContainer}>
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

          <Text style={styles.sectionTitle}>Fav Artists</Text>
          {renderArtistIcons(profileData.favArtists || [])}
        </View>
      ) : (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{profileData.username}</Text>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            value={profileData.bio}
            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
          />

          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={styles.input}
            value={
              profileData.birthday?.toDate
                ? profileData.birthday.toDate().toISOString().substring(0, 10)
                : profileData.birthday
            }
            onChangeText={(text) =>
              setProfileData({ ...profileData, birthday: text })
            }
          />

          <Text style={styles.label}>Pronouns</Text>
          <TextInput
            style={styles.input}
            value={profileData.pronouns}
            onChangeText={(text) =>
              setProfileData({ ...profileData, pronouns: text })
            }
          />

          <Text style={styles.label}>Current Vibe</Text>
          <TextInput
            style={styles.input}
            value={profileData.currentVibe}
            onChangeText={(text) =>
              setProfileData({ ...profileData, currentVibe: text })
            }
          />

          <Text style={styles.label}>Looking For</Text>
          <TextInput
            style={styles.input}
            value={profileData.lookingFor}
            onChangeText={(text) =>
              setProfileData({ ...profileData, lookingFor: text })
            }
          />

          <Text style={styles.label}>Relationship Status</Text>
          <TextInput
            style={styles.input}
            value={profileData.relationshipStatus}
            onChangeText={(text) =>
              setProfileData({ ...profileData, relationshipStatus: text })
            }
          />

          <Text style={styles.label}>Fav Artists (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={(profileData.favArtists || []).join(', ')}
            onChangeText={(text) =>
              setProfileData({
                ...profileData,
                favArtists: text.split(',').map((s) => s.trim()),
              })
            }
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  userIdText: {
    color: '#888',
    fontSize: 12,
  },
  dp: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginVertical: 20,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  nameOverlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'right'
  },
  editButton: {
    backgroundColor: Colors.buttonBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewModeContainer: {
    alignItems: 'flex-start',
  },
  nameText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
    textAlign: 'justify',
  },
  vibeText: {
    fontSize: 20,
    color: Colors.buttonBackground,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 15,
    marginBottom: 20,
  },
  genreIconWrapper: {
    alignItems: 'center',
    width: 80,
  },
  genreVectorIcon: {
    marginBottom: 5,
  },
//   genreText: {
//     color: '#ccc',
//     fontSize: 12,
//     textAlign: 'center',
//   },
  fieldContainer: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
genreWrapper: {
  width: '100%',
  paddingVertical: 10,
  marginBottom: 20,
},

genreCircleWrapper: {
  alignItems: 'center',
  marginRight: 15,
  width: 70,
},

genreCircle: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#1e1e1e',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: Colors.buttonBackground,
},

genreText: {
  color: '#ccc',
  fontSize: 12,
  textAlign: 'center',
  marginTop: 5,
},

});

export default ProfileScreen;

