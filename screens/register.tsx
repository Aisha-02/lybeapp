import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseconfig.js';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import styles from '../styles/AuthStyles'; // Use shared style
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation }: any) => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisibleconfirm, setPasswordVisibleconfirm] = useState(false);
  const auth = getAuth(app);
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!userId || !username || !email || !phone || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'All fields are required.' });
      return;
    }

    if (!isEmailValid(email)) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address.' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match.' });
      return;
    }

    try {
      const db = getFirestore();
      const userIdQuery = query(collection(db, 'users'), where('userId', '==', userId));
      const snapshot = await getDocs(userIdQuery);

      if (!snapshot.empty) {
        Toast.show({ type: 'error', text1: 'User ID Taken', text2: 'Please choose a different User ID.' });
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

      Toast.show({ type: 'success', text1: 'Registration Successful 🎉', text2: 'Please login to continue.' });
      navigation.navigate('CompleteProfile', { uid: userCredential.user.uid });
    } catch (error: any) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Create an Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="User ID (Unique)"
          placeholderTextColor="#888"
          value={userId}
          onChangeText={setUserId}
        />
        <Ionicons name="person-outline" size={24} color="#888" style={styles.inputIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <Ionicons name="person-circle-outline" size={24} color="#888" style={styles.inputIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={24} color="#888" style={styles.inputIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Ionicons name="call-outline" size={24} color="#888" style={styles.inputIcon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry= {!isPasswordVisible}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry = {!isPasswordVisibleconfirm}
        />
        <Ionicons name="lock-open-outline" size={24} color="#888" style={styles.inputIcon} />
        <Ionicons
          name={!isPasswordVisibleconfirm ? 'eye-off-outline' : 'eye-outline'}
          size={24}
          color="#888"
          style={[styles.inputIcon, { right: 16, left: 'auto', position: 'absolute' }]}
          onPress={() => setPasswordVisibleconfirm(prev => !prev)}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <LinearGradient
        // Adding gradient to the button with 4 shades
          colors={['#E100FF', '#2575fc', '#1C15ED', '#0544BA']}   
          locations={[0, 0.4, 0.6, 0.7]} // Adjust the locations for gradient effect
          start={{ x: 0, y: 1 }}  // Adjust the start and end points for gradient effect
          end={{ x: 2, y: 3 }} // Adjust the start and end points for gradient effect
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>REGISTER</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>
          Already have an account? <Text style={styles.registerLink}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default RegisterScreen;
