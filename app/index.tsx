import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Layout from '../app/_layout';
import Toast from 'react-native-toast-message';
//mport { GoogleSignin } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId: '814924696691-li0q9bhp5biqr04183filtevf7pi8bn0.apps.googleusercontent.com', // very important
// });

export default function page() {
  return (
    <>
    <SafeAreaView>
    <NavigationContainer>
      <Layout />
    </NavigationContainer>
    <Toast/>
    </SafeAreaView>
    </>
  );
}
