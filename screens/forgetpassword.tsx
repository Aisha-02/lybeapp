import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import app from '../firebaseconfig.js';
import styles from '../styles/AuthStyles';
import { LinearGradient} from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

const ForgetPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const auth = getAuth(app);
  const handleForgetPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please enter your email address.',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: 'success',
        text1: 'Success 🎉',
        text2: 'Password reset email sent!',
      });
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reset Your Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Ionicons name="mail-outline" size={24} color="#888" style={styles.inputIcon} />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleForgetPassword}>
        <LinearGradient
        // Adding gradient to the button with 4 shades
          colors={['#E100FF', '#2575fc', '#1C15ED', '#0544BA']}   
          locations={[0, 0.4, 0.6, 0.7]} // Adjust the locations for gradient effect
          start={{ x: 0, y: 1 }}  // Adjust the start and end points for gradient effect
          end={{ x: 2, y: 3 }} // Adjust the start and end points for gradient effect
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Send Reset Email</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.registerText}>
          Back to <Text style={styles.registerLink}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

export default ForgetPasswordScreen;
