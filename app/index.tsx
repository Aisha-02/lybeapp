import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Layout from '../app/_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#E100FF" />
      </View>
    );
  }

  return (
    <>
     <SafeAreaProvider>
     <NavigationContainer>
       <Layout />
     </NavigationContainer>
     <Toast/>
     </SafeAreaProvider>
     </>
  );
}
