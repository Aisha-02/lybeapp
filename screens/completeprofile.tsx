import React, { useState, useRef } from 'react';
import {
  Animated,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  PanResponder,
} from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';
import styles from '../styles/PrefereneStyles';

const { width } = Dimensions.get('window');

const vibeOptions = ['Chill AF 🤘', 'Party Animal 🥳', 'Hopeless Romantic 🔥', 'Filmy & Dramatic 🎬', 'Meme Lord 😂', 'Rizzy 😍'];
const musicOptions = ['Bollywood', 'Indie', 'Hip-Hop/Rap', 'Lo-Fi', 'Pop', 'Rock', 'Sufi', 'Classical'];
const connectionVibes = ['Deep conversations', 'Fun and Flirty', 'Just vibing with music', 'Travel buddy', 'Serious relationship', 'Chill friendships'];
const musicLanguages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Other'];
const openToDifferentTaste = ['Hell yes!', 'Maybe, if we vibe otherwise', 'Nah, music taste is everything'];
const relationshipOptions = ['Single', 'In a relationship', 'Married', 'Complicated', 'Prefer not to say'];

const CompleteProfile = ({ route, navigation }: any) => {
  const userId = route.params?.uid;
  const db = getFirestore();
  const storage = getStorage();

  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [currentVibe, setCurrentVibe] = useState('');
  const [birthday, setBirthday] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<string[]>([]);
  const [vibe, setVibe] = useState('');
  const [musicTaste, setMusicTaste] = useState<string[]>([]);
  const [idealConnection, setIdealConnection] = useState('');
  const [musicLangPref, setMusicLangPref] = useState<string[]>([]);
  const [openToDifferentMusic, setOpenToDifferentMusic] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const pages = [
    () => (
      <View>
        <Question title="'Upload your vibe pic 📸'" type="image" selectedValues={profilePic} onPickImage={pickImage} />
        <Question title='Write a short and fun bio ✍️' type='text' selectedValues={bio} onSelect={setBio} />
        <Question title='Your current vibe is... 🎯' type='text' selectedValues={currentVibe} onSelect={setCurrentVibe} />
        <Question title='When’s your birthday? 🎂' type='date' selectedValues={birthday} onSelect={setBirthday} />
        <Question title="Your pronouns are... 🏳️‍🌈" type="text" selectedValues={pronouns} onSelect={setPronouns} />
      </View>
    ),
    () => (
      <Question title="Pick one that screams *you* 🌟" type="chip" options={vibeOptions} selectedValues={vibe} onSelect={setVibe} />
    ),
    () => (
      <Question title="Your playlist vibes with...? 🎵" type="chip" options={musicOptions} selectedValues={musicTaste} onSelect={(item: string) => toggleSelection(item, musicTaste, setMusicTaste)} />
    ),
    () => (
      <Question title="What kind of connection are you really vibing with? 💛" type="chip" options={connectionVibes} selectedValues={idealConnection} onSelect={setIdealConnection} />
    ),
    () => (
      <Question title="Languages you groove to 🔊" type="chip" options={musicLanguages} selectedValues={musicLangPref} onSelect={(item: string) => toggleSelection(item, musicLangPref, setMusicLangPref)} />
    ),
    () => (
      <Question title="Would you connect with someone who loves different music? 🎶" type="chip" options={openToDifferentTaste} selectedValues={openToDifferentMusic} onSelect={setOpenToDifferentMusic} />
    ),
    () => (
      <Question title="What's your relationship status?💕" type="chip" options={relationshipOptions} selectedValues={relationshipStatus} onSelect={(item: string) => toggleSelection(item, relationshipStatus, setRelationshipStatus)} />
    )
  ];

  const toggleSelection = (item: string, list: string[], setter: Function) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmit = async () => {
    try {
      let photoURL = '';
      if (profilePic) {
        const response = await fetch(profilePic);
        const blob = await response.blob();

        const photoRef = ref(storage, `user_photos/${userId}.jpg`);
        await uploadBytes(photoRef, blob);
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, 'user_preferences', userId), {
        profilePic: photoURL,
        bio,
        currentVibe,
        birthday,
        pronouns,
        relationshipStatus,
        vibe,
        musicTaste,
        idealConnection,
        musicLangPref,
        openToDifferentMusic,
      });

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const scrollToPage = (page: number) => {
    scrollRef.current?.scrollTo({ x: page * width, animated: true });
    setCurrentPage(page);
  };

  return (
    <LinearGradient colors={['#3A0CA3', '#480CA8', '#4361EE']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ProgressBar currentStep={currentPage} totalSteps={pages.length} />
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
            setCurrentPage(page);
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {pages.map((Page, index) => (
            <Animated.View key={index} style={{ width, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={{
                backgroundColor: '#F2547D',
                borderRadius: 25,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 5,
                width: '100%',
                transform: [{ scale: scrollX.interpolate({
                  inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                  outputRange: [0.9, 1, 0.9],
                  extrapolate: 'clamp',
                }) }]
              }}>
                {Page()}
              </Animated.View>
            </Animated.View>
          ))}
        </Animated.ScrollView>

        {currentPage < pages.length - 1 ? (
          <TouchableOpacity onPress={() => scrollToPage(currentPage + 1)} style={styles.navButton}>
            <Ionicons name="arrow-forward-circle" size={32} color="#F8AC4B" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        )}

        {currentPage > 0 && (
          <TouchableOpacity onPress={() => scrollToPage(currentPage - 1)} style={styles.navBack}>
            <Ionicons name="arrow-back-circle" size={32} color="#F8AC4B" />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CompleteProfile;
