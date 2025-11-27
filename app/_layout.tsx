import playlists from '@/screens/Playlists';
import TrackDetails from '@/screens/TrackDetails';
import ArtistSongs from '@/screens/artistSongs';
import ProfileScreen from '@/screens/userProfile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from '../screens/completeprofile';
import ForgetPassword from '../screens/forgetpassword';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import TabLayout from './(tabs)/TabLayout';
import MessageScreen from '@/screens/messages';
import NotificationScreen from '@/screens/Notification';
import TrackPlayer, { Capability, State, Event } from 'react-native-track-player';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CompleteProfile: undefined;
  Forget: undefined;
  TrackDetails: undefined;
  Home: undefined;
  ArtistSongs: { artistId: string; artistName: string };
  Playlists: undefined;
  ProfileScreen: { userId: string };
  messages: undefined;
  notification: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppLayout = () => {

  useEffect(() => {
    let initialized = false;

    async function initPlayer() {
      try {
        if (initialized) return;

        await TrackPlayer.setupPlayer();

        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });

        console.log("🎵 TrackPlayer initialized globally");
        initialized = true;

      } catch (err) {
        console.log("🔥 TrackPlayer init error:", err);
      }
    }

    initPlayer();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CompleteProfile" component={Profile} />
        <Stack.Screen name="Forget" component={ForgetPassword} />
        <Stack.Screen name="TrackDetails" component={TrackDetails} />
        <Stack.Screen name="ArtistSongs" component={ArtistSongs} />
        <Stack.Screen name="Playlists" component={playlists} />
        <Stack.Screen name="Home" component={TabLayout} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="notification" component={NotificationScreen} />
        <Stack.Screen name="messages" component={MessageScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppLayout;
