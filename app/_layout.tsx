import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ForgetPassword from '../screens/forgetpassword';
import Profile from '../screens/completeprofile';
import TabLayout from './(tabs)/TabLayout';
import TrackDetails from '@/screens/TrackDetails';
import ArtistSongs from '@/screens/artistSongs';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CompleteProfile: undefined; // or { someParam: string } if your profile screen expects params
  Forget: undefined;
  TrackDetails: undefined; // or with params if needed
  Home: undefined;
  ArtistSongs: { artistId: string; artistName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppLayout = () => {
  return (
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
      <Stack.Screen name="Home" component={TabLayout} />
    </Stack.Navigator>
  );
};

export default AppLayout;
