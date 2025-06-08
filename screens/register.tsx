import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseconfig.js';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import styles from '../styles/AuthStyles'; // Use shared style
import { Colors } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterScreen = ({ navigation }: any) => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisibleconfirm, setPasswordVisibleconfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone validation function - accepts common formats
  const isPhoneValid = (phone: string) => {
    // This regex allows for various phone formats:
    // - 10 digits: 1234567890
    // - With spaces: 123 456 7890
    // - With dashes: 123-456-7890
    // - With parentheses: (123) 456-7890
    // - With country code: +91 1234567890
    const phoneRegex = /^(\+\d{1,3}\s?)?((\(\d{1,3}\))|\d{1,3})[-.\s]?\d{3,4}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async () => {
    if (!userId || !username || !email || !phone || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    if (!isEmailValid(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Enter a valid email address.',
      });
      return;
    }

    if (!isPhoneValid(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Enter a valid phone number.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords must match.',
      });
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore();
      const userIdQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const snapshot = await getDocs(userIdQuery);

      if (!snapshot.empty) {
        Toast.show({
          type: 'error',
          text1: 'User ID Taken',
          text2: 'Please choose a different User ID.',
        });
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(collection(db, 'users'), userCredential.user.uid), {
        userId,
        username,
        email,
        phone,
        createdAt: serverTimestamp(),
      });

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now log in.',
      });

      navigation.navigate('CompleteProfile', { uid: userCredential.user.uid });
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.safeArea}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableResetScrollToCoords={false}
        extraScrollHeight={20}
        extraHeight={Platform.OS === 'ios' ? 120 : 0}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={styles.container}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.header}>Create an Account</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="User ID (Unique)"
              placeholderTextColor={Colors.placeholder}
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
            <Ionicons name="person-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={Colors.placeholder}
              value={username}
              onChangeText={setUsername}
            />
            <Ionicons name="person-circle-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor={Colors.placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Ionicons name="call-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={Colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isPasswordVisibleconfirm}
              autoCapitalize="none"
            />
            <Ionicons name="lock-open-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
            <Ionicons
              name={!isPasswordVisibleconfirm ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={Colors.icon}
              style={[styles.inputIcon, { right: 16, left: 'auto', position: 'absolute' }]}
              onPress={() => setPasswordVisibleconfirm(prev => !prev)}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
            <LinearGradient
              colors={[Colors.linear_grad3, Colors.linear_grad4, Colors.linear_grad5, Colors.linear_grad6]}
              locations={[0, 0.4, 0.6, 0.7]}
              start={{ x: 0, y: 1 }}
              end={{ x: 2, y: 3 }}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{loading ? 'REGISTERING...' : 'REGISTER'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>
              Already have an account? <Text style={styles.registerLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default RegisterScreen;
