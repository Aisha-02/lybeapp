import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import app from '../firebaseconfig';
import { Colors } from '../constants/Colors';
import Toast from 'react-native-toast-message';
import styles from '../styles/AuthStyles'; // 👈 Importing shared styles
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db, googleProvider } from '../firebaseconfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
        text1: 'Sign In Failed',
        text2: error.message || 'Something went wrong with Google sign-in.',
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
          text1: 'Sign In Successful 🎉',
          text2: 'Welcome! Please complete your profile.',
        });
        navigation.navigate('CompleteProfile', { uid: user.uid });
      } else {
        // Navigate to home for existing users
        Toast.show({
          type: 'success',
          text1: 'Sign In Successful 🎉',
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
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    };

  }


  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Login Successful 🎉',
        text2: 'Welcome back!',
      });
      navigation.dispatch(
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      )
      // navigation.navigate('CompleteProfile', { uid: userCredential.user.uid });
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid credentials. Please try again.',
      });
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
          text1: 'Not Implemented',
          text2: 'Google Sign In for mobile app requires additional setup.',
        });
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: error.message || 'Something went wrong with Google sign-in.',
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
    <View style={styles.container}>

      <Image
        source={require('../assets/images/logo.png')} // Replace with your logo
        style={styles.logo}
      />

      <Text style={styles.header}>Welcome Back 👋</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Email or Phone No"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={25} color="#888" style={styles.inputIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.inputIcon} />
        <Ionicons
          name={!isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="#888"
          style={[styles.inputIcon, { right: 16, left: 'auto', position: 'absolute' }]}
          onPress={() => setPasswordVisible(prev => !prev)}
        />
      </View>

      <TouchableOpacity onPress={handleForgetPassword}>
        <Text style={styles.forgetPassword}>Forget Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <LinearGradient
          // Adding gradient to the button with 4 shades
          colors={['#E100FF', '#2575fc', '#1C15ED', '#0544BA']}
          locations={[0, 0.4, 0.6, 0.7]} // Adjust the locations for gradient effect
          start={{ x: 0, y: 1 }}  // Adjust the start and end points for gradient effect
          end={{ x: 2, y: 3 }} // Adjust the start and end points for gradient effect
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} // Replace with your Google logo
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

      <Toast />
    </View>
  );
};

export default LoginScreen;