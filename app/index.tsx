import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Layout from '../app/_layout';
import styles from '../styles/Index_TabLayout';
import { Colors } from '../constants/Colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { auth } from '../firebaseconfig';
import { View, ActivityIndicator } from 'react-native';
import { User , onAuthStateChanged} from 'firebase/auth'; // Import User type from Firebase Auth
//import { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId: '814924696691-li0q9bhp5biqr04183filtevf7pi8bn0.apps.googleusercontent.com', // very important
// });

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
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
    <>
     <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}}>
     <NavigationContainer>
       <Layout />
     </NavigationContainer>
     <Toast/>
     </SafeAreaView>
     </SafeAreaProvider>
     </>
  );
}
