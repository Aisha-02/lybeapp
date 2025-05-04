import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, StyleSheet, ScrollView, Pressable } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import  styles from '../styles/PrefereneStyles';
import app from '../firebaseconfig';
import { useNavigation } from '@react-navigation/native';

interface Props {
  onClose: () => void;
}

const MenuScreen: React.FC<Props> = ({ onClose }) => {
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const navigation = useNavigation<any>();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.username || 'User');
        }
        const prefDoc = await getDoc(doc(db, 'user_preferences', user.uid));

        if (prefDoc.exists()) {
          const prefData = prefDoc.data();
          setProfilePic(prefData.profilePic || 'https://via.placeholder.com/100');
        }
      }
    };

    fetchUserData();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
    onClose();
  };

  const menuItems = [
    'Your Connections',
    'Playlists',
    'Settings',
    'Help & Support',
    'Logout',
  ];

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        {/* Cancel Icon */}
        <TouchableOpacity style={styles.cancelIcon} onPress={onClose}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        {/* Scrollable Menu */}
        <ScrollView contentContainerStyle={styles.menuContent}>
          {/* Profile */}
          <View style={styles.profileSection}>
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
            <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item === 'Logout' ? handleLogout : () => {}}
              style={styles.menuItem}
            >
              <Text style={[styles.menuText, item === 'Logout' && styles.logoutText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Pressable>
  );
};

export default MenuScreen;
