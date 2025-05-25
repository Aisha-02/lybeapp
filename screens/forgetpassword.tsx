import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import app from '../firebaseconfig.js';
import styles from '../styles/AuthStyles';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgetPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const handleForgetPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Enter your email to continue.',
      });
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Check your inbox to reset your password.',
      });
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: error.message || 'Unable to send reset email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.header}>Reset Your Password</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your registered email"
              placeholderTextColor={Colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail-outline" size={24} color={Colors.icon} style={styles.inputIcon} />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleForgetPassword}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.linear_grad3, Colors.linear_grad4, Colors.linear_grad5, Colors.linear_grad6]}
              locations={[0, 0.4, 0.6, 0.7]}
              start={{ x: 0, y: 1 }}
              end={{ x: 2, y: 3 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'SENDING...' : 'SEND RESET EMAIL'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.registerText}>
              Back to <Text style={styles.registerLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;
