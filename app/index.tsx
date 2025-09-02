import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Layout from '../app/_layout';
import styles from '../styles/Index_TabLayout';
import { Colors } from '../constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseconfig';
import { View, ActivityIndicator, Platform, Alert } from 'react-native';
import { User, onAuthStateChanged } from 'firebase/auth';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { setDoc, doc , getDoc} from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useNavigation } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const navigation = useNavigation<any>();

  const registerForPushNotificationsAsync = async () => {
    let token;
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot receive notifications without permission.');
        return;
      }
  
      try {
        // Include projectId for EAS apps
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId,
        });
  
        console.log('Expo Push Token:', expoPushToken);
        return expoPushToken;
      } catch (err) {
        console.error('Error getting push token:', err);
        return;
      }
    } else {
      Alert.alert('Error', 'Must use physical device for Push Notifications');
    }
  };
  

  useEffect(() => {
    const setupPush = async () => {
      const token = await registerForPushNotificationsAsync();
      const uid = auth.currentUser?.uid;
    
      if (token && uid) {
        const userRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userRef);
        const currentToken = userDocSnap.data()?.expoPushToken;
    
        if (currentToken !== token) {
          await setDoc(userRef, { expoPushToken: token }, { merge: true });
          console.log('Push token updated in Firestore');
        } else {
          console.log('Push token unchanged');
        }
      }
    };
    

    setupPush();

    // Listen for foreground notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(title || 'Notification', body || '');
    });
    

    // Handle notification tap
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      // Navigate or handle data
      const screen = response.notification.request.content.data?.screen;
      if (screen === 'notification') {
        navigation.navigate('notification');
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.viewProp}>
        <ActivityIndicator size="large" color={Colors.activity} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Layout />
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
