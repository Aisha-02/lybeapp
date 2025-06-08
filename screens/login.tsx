import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView
} from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import app from '../firebaseconfig';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import styles from '../styles/AuthStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db, googleProvider } from '../firebaseconfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    // Check for redirect result on component mount (for web)
    if (Platform.OS === 'web') {
      checkRedirectResult();
    }
  }, []);

  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // User successfully signed in with redirect
        handleGoogleUserData(result.user);
      }
    } catch (error: any) {
      console.error("Redirect result error:", error);
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Failed',
        text2: error.message || 'Please try again.',
      });
    }
  };

  const handleGoogleUserData = async (user: any) => {
    try {
      // Check if user profile exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create a new user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          username: user.displayName || 'User',
          createdAt: new Date(),
        });
        // Navigate to complete profile for new users
        Toast.show({
          type: 'success',
          text1: 'Signed In',
          text2: 'Welcome! Let’s complete your profile.',
        });
        navigation.navigate('CompleteProfile', { uid: user.uid });
      } else {
        // Navigate to home for existing users
        Toast.show({
          type: 'success',
          text1: 'Signed In',
          text2: 'Welcome back!',
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error: any) {
      console.error("Error handling Google user data:", error);
      Toast.show({
        type: 'error',
        text1: 'Sign-In Error',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Info',
        text2: 'Enter both email and password to continue.',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Logged In',
        text2: 'Welcome back!',
      });
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'CompleteProfile', params: { uid: userCredential.user.uid } }],

      // })
      navigation.dispatch(
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Use popup for desktop browsers and redirect for mobile browsers
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          await signInWithRedirect(auth, googleProvider);
          // The result will be handled in useEffect with getRedirectResult
        } else {
          const result = await signInWithPopup(auth, googleProvider);
          await handleGoogleUserData(result.user);
        }
      } else {
        // For React Native mobile, we'll need to use Expo's AuthSession
        // This is handled separately with expo-auth-session
        Toast.show({
          type: 'error',
          text1: 'Not Supported',
          text2: 'Google Sign-In requires additional setup in the mobile app.',
        });
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      Toast.show({
        type: 'error',
        text1: 'Sign-In Failed',
        text2: error.message || 'Unable to complete Google sign-in. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgetPassword = () => {
    navigation.navigate('Forget');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableResetScrollToCoords={false}
        extraScrollHeight={20}
        extraHeight={Platform.OS === 'ios' ? 120 : 0}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.header}>Welcome Back 👋</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail-outline" size={25} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
            />
            <Ionicons name="lock-closed-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
            <Ionicons
              name={!isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={Colors.icon}
              style={[styles.inputIcon, { right: 16, left: 'auto', position: 'absolute' }]}
              onPress={() => setPasswordVisible(prev => !prev)}
            />
          </View>

          <TouchableOpacity onPress={handleForgetPassword}>
            <Text style={styles.forgetPassword}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={[Colors.linear_grad3, Colors.linear_grad4, Colors.linear_grad5, Colors.linear_grad6]}
              locations={[0, 0.4, 0.6, 0.7]}
              start={{ x: 0, y: 1 }}
              end={{ x: 2, y: 3 }}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{loading ? 'LOGGING IN...' : 'LOGIN'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
              resizeMode="contain"
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>
              New User? <Text style={styles.registerLink}>Register Here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen;
