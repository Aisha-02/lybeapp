import React, { useState, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import {
  Animated,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Keyboard
} from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';
import styles from '../styles/PreferenceStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width } = Dimensions.get('window');

const vibeOptions = ['Chill AF 🤘', 'Party Animal 🥳', 'Hopeless Romantic 🔥', 'Filmy & Dramatic 🎬', 'Meme Lord 😂', 'Rizzy 😍'];
const musicOptions = ['Bollywood', 'Indie', 'Hip-Hop', 'Lo-Fi', 'Pop', 'Rock', 'Sufi', 'Classical'];
const connectionVibes = ['Deep conversations', 'Fun and Flirty', 'Just vibing with music', 'Travel buddy', 'Serious relationship', 'Chill friendships'];
const musicLanguages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Other'];
const openToDifferentTaste = ['Hell yes!', 'Maybe, if we vibe otherwise', 'Nah, music taste is everything'];
const relationshipOptions = ['Single', 'In a relationship', 'Married', 'Complicated', 'Prefer not to say'];

const singerSuggestions = {
  Hindi: ['Arijit Singh', 'Shreya Ghoshal', 'Neha Kakkar', 'Sonu Nigam', 'KK', 'Mohit Chauhan', 'Sunidhi Chauhan'],
  English: ['Taylor Swift', 'Ed Sheeran', 'Ariana Grande', 'The Weeknd', 'Billie Eilish', 'Harry Styles', 'Drake'],
  Punjabi: ['Diljit Dosanjh', 'Sidhu Moose Wala', 'AP Dhillon', 'Ammy Virk', 'Jass Manak'],
  Tamil: ['Anirudh Ravichander', 'Dhanush', 'Sid Sriram', 'Shreya Ghoshal', 'Chinmayi'],
  Telugu: ['SP Balasubrahmanyam', 'Sid Sriram', 'Geetha Madhuri', 'Mangli', 'Hemachandra'],
  Marathi: ['Ajay Gogavale', 'Shankar Mahadevan', 'Avadhoot Gupte', 'Shalmali Kholgade'],
  Bengali: ['Arijit Singh', 'Rupam Islam', 'Anupam Roy', 'Shreya Ghoshal'],
};

interface CompleteProfileProps {
  route: {
    params?: {
      uid: string;
    };
  };
  navigation: any;
}

const CompleteProfile = ({ route, navigation }: CompleteProfileProps) => {
  const userId = route.params?.uid;
  const db = getFirestore();
  const storage = getStorage();

  const [currentPage, setCurrentPage] = useState(0);
  const [furthestCompletedPage, setFurthestCompletedPage] = useState(-1);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
  const [favSingers, setFavSingers] = useState<string[]>([]);

  const [availableSingers, setAvailableSingers] = useState<string[]>([]);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Update furthestCompletedPage whenever a page is completed
  useEffect(() => {
    if (isPageComplete(currentPage) && currentPage > furthestCompletedPage) {
      setFurthestCompletedPage(currentPage);
    }
  }, [currentPage, bio, profilePic, birthday, pronouns, vibe, musicTaste, idealConnection, 
      musicLangPref, openToDifferentMusic, relationshipStatus, favSingers]);

  useEffect(() => {
    // Calculate available singers based on selected music languages
    const langList = musicLangPref.map(lang => (lang === 'Other' ? 'Hindi' : lang)) as (keyof typeof singerSuggestions)[];
    let singers: string[] = [];

    langList.forEach(lang => {
      if (singerSuggestions[lang]) {
        singers.push(...singerSuggestions[lang]);
      }
    });

    const uniqueSingers = Array.from(new Set(singers));
    const limit = langList.length > 1 ? 8 : 5;
    setAvailableSingers(uniqueSingers.slice(0, limit));
  }, [musicLangPref]);

  // Handles both single and multi select toggle
  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Page completion check to enable next button
  const isPageComplete = (page: number) => {
    switch (page) {
      case 0:
        return profilePic !== null && bio.trim() !== '' && birthday && pronouns.trim() !== '';
      case 1:
        return vibe.trim() !== '';
      case 2:
        return musicTaste.length > 0;
      case 3:
        return idealConnection.trim() !== '';
      case 4:
        return musicLangPref.length > 0;
      case 5:
        return openToDifferentMusic.trim() !== '';
      case 6:
        return relationshipStatus.length > 0;
      case 7:
        return favSingers.length > 0;
      default:
        return true;
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const currentPageIndex = Math.floor(offsetX / pageWidth);
    const progress = (offsetX % pageWidth) / pageWidth;
    
    // If trying to scroll forward beyond completed pages, snap back
    if (currentPageIndex === currentPage && progress > 0 && !isPageComplete(currentPage)) {
      scrollRef.current?.scrollTo({ x: currentPage * pageWidth, animated: true });
    }
  };

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

  const handleSubmit = async () => {
    // Check if userId exists
    if (!userId) {
      console.error('User ID is undefined');
      return; // Exit the function early
    }

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
        favSingers,
      });

      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const renderPage = (Page: () => JSX.Element, index: number) => {
    return (
      <Animated.View
        key={index}
        style={{
          width,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            backgroundColor: '#09011D',
            borderRadius: 25,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 5,
            width: '100%',
            transform: [
              {
                scale: scrollX.interpolate({
                  inputRange: [(index - 1) * width, index * width, (index + 1) * width],
                  outputRange: [0.9, 1, 0.9],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          {index === 0 ? (
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              enableResetScrollToCoords={false}
              extraScrollHeight={20}
              extraHeight={Platform.OS === 'ios' ? 120 : 0}
              keyboardShouldPersistTaps="handled"
            >
              {Page()}
            </KeyboardAwareScrollView>
          ) : (
            Page()
          )}
        </Animated.View>
      </Animated.View>
    );
  };

  const pages = [
    () => (
      <View>
        <Question title="'Upload your vibe pic 📸'" type="image" selectedValues={profilePic} onPickImage={pickImage} />
        <Question title="Write a short and fun bio ✍️" type="text" selectedValues={bio} onSelect={setBio} />
        <Question title="Your current vibe is... 🎯" type="text" selectedValues={currentVibe} onSelect={setCurrentVibe} />
        <Question title="When's your birthday? 🎂" type="date" selectedValues={birthday} onSelect={setBirthday} />
        <Question title="Your pronouns are... 🏳️‍🌈" type="text" selectedValues={pronouns} onSelect={setPronouns} />
      </View>
    ),
    () => (
      <Question title="Pick one that screams *you* 🌟" type="chip" options={vibeOptions} selectedValues={vibe} onSelect={setVibe} />
    ),
    () => (
      <Question
        title="Your playlist vibes with...? 🎵"
        type="chip"
        options={musicOptions}
        selectedValues={musicTaste}
        onSelect={(item: string) => toggleSelection(item, musicTaste, setMusicTaste)}
      />
    ),
    () => (
      <Question title="What kind of connection are you really vibing with? 💛" type="chip" options={connectionVibes} selectedValues={idealConnection} onSelect={setIdealConnection} />
    ),
    () => (
      <Question
        title="Languages you groove to 🔊"
        type="chip"
        options={musicLanguages}
        selectedValues={musicLangPref}
        onSelect={(item: string) => toggleSelection(item, musicLangPref, setMusicLangPref)}
      />
    ),
    () => (
      <Question title="Would you connect with someone who loves different music? 🎶" type="chip" options={openToDifferentTaste} selectedValues={openToDifferentMusic} onSelect={setOpenToDifferentMusic} />
    ),
    () => (
      <Question
        title="What's your relationship status?💕"
        type="chip"
        options={relationshipOptions}
        selectedValues={relationshipStatus}
        onSelect={(item: string) => toggleSelection(item, relationshipStatus, setRelationshipStatus)}
      />
    ),
    () => (
      <Question
        title="Which of these singers are your all-time faves? 🎤"
        type="chip"
        options={availableSingers}
        selectedValues={favSingers}
        onSelect={(item: string) => toggleSelection(item, favSingers, setFavSingers)}
      />
    ),
  ];

  const scrollToPage = (page: number) => {
    if (page < 0 || page >= pages.length) return;
    scrollRef.current?.scrollTo({ x: page * width, animated: true });
    setCurrentPage(page);
  };

  return (
    <LinearGradient colors={['#11002E', '#2a2a2a']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ProgressBar currentStep={currentPage} totalSteps={pages.length} />

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const page = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
            if (page > currentPage && !isPageComplete(currentPage)) {
              scrollRef.current?.scrollTo({ x: currentPage * width, animated: true });
            } else {
              setCurrentPage(page);
            }
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        >
          {pages.map((Page, index) => renderPage(Page, index))}
        </Animated.ScrollView>

        {/* Completion reminder message */}
        {!isPageComplete(currentPage) && (
          <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
            <Text style={{ color: '#FF6B6B', fontSize: 14, textAlign: 'center' }}>
              Please complete this section before proceeding.
            </Text>
          </View>
        )}

        {/* Navigation buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          padding: 20,
          paddingBottom: keyboardVisible && Platform.OS === 'ios' ? 40 : 20 // Add extra padding when keyboard is visible on iOS
        }}>
          {currentPage > 0 && (
            <TouchableOpacity
              onPress={() => scrollToPage(currentPage - 1)}
              style={{
                backgroundColor: '#4B4B4B',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 25,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                <Ionicons name="arrow-back" size={16} /> Back
              </Text>
            </TouchableOpacity>
          )}

          {currentPage < pages.length - 1 && (
            <TouchableOpacity
              onPress={() => {
                if (isPageComplete(currentPage)) {
                  Keyboard.dismiss();
                  scrollToPage(currentPage + 1);
                }
              }}
              disabled={!isPageComplete(currentPage)}
              style={{
                backgroundColor: isPageComplete(currentPage) ? '#7A5AF8' : '#4B4B4B',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 25,
                marginLeft: currentPage === 0 ? 'auto' : 0,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>
                Next <Ionicons name="arrow-forward" size={16} />
              </Text>
            </TouchableOpacity>
          )}

          {currentPage === pages.length - 1 && (
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: '#7A5AF8',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 25,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CompleteProfile;
