import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import IonIcon from "@expo/vector-icons/Ionicons";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import styles from "../../styles/ConnectStyles";
import { Colors } from '../../constants/Colors';
import { useRoute, useNavigation } from "@react-navigation/native";
import { auth } from "../../firebaseconfig";

type User = {
  id: string;
  username: string;
  userId: string;
  profilePic?: string;
  currentVibe?: string;
  email?: string;
};

const Connect = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const track = (route as any)?.params?.track || null;

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Search by username in users collection
      const usernameQuery = query(
        collection(db, "users"),
        where("username", ">=", searchQuery),
        where("username", "<=", searchQuery + '\uf8ff')
      );

      // Step 2: Search by userId in users collection
      const userIdQuery = query(
        collection(db, "users"),
        where("userId", ">=", searchQuery),
        where("userId", "<=", searchQuery + '\uf8ff')
      );

      const [usernameSnapshot, userIdSnapshot] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(userIdQuery)
      ]);

      const foundUsers: User[] = [];
      const userIds = new Set();

      // Process username results
      usernameSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (!userIds.has(doc.id)) {
          foundUsers.push({
            id: doc.id,
            username: userData.username,
            userId: userData.userId,
            email: userData.email,
            profilePic: '', // Will be fetched from user_preferences
            currentVibe: '', // Will be fetched from user_preferences
          });
          userIds.add(doc.id);
        }
      });

      // Process userId results
      userIdSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (!userIds.has(doc.id)) {
          foundUsers.push({
            id: doc.id,
            username: userData.username,
            userId: userData.userId,
            email: userData.email,
            profilePic: '', // Will be fetched from user_preferences
            currentVibe: '', // Will be fetched from user_preferences
          });
          userIds.add(doc.id);
        }
      });

      // Step 3: Fetch profile data from user_preferences collection for each found user
      const usersWithPreferences = await Promise.all(
        foundUsers.map(async (user) => {
          try {
            const preferencesDoc = await getDoc(doc(db, "user_preferences", user.id));
            if (preferencesDoc.exists()) {
              const preferencesData = preferencesDoc.data();
              return {
                ...user,
                profilePic: preferencesData.profilePic || '',
                currentVibe: preferencesData.currentVibe || '',
              };
            }
            return user; // Return user without preferences if document doesn't exist
          } catch (error) {
            console.error("Error fetching preferences for user ${user.id}:", error);
            return user; // Return user without preferences if error occurs
          }
        })
      );

      console.log("Final users with preferences:", usersWithPreferences);
      setUsers(usersWithPreferences);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const handleDedicate = async (userId: string, username: string) => {
    const me = auth.currentUser;
    if (!me) return;

    if (!track) {
      navigation.navigate("SearchSongs", { userId, username });
      return;
    }

    Alert.alert(
      "Dedicate",
      `Do you want to dedicate this track to ${username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            try {
        // 1. Fetch my user profile (to get my username)
        const meDoc = await getDoc(doc(db, "users", me.uid));
        const meData = meDoc.data();
        const fromName = meData?.username || me.email || "Someone";

        // 2. Save request in Firestore
        const requestRef = doc(db, "users", userId, "friendRequests", me.uid);
        await setDoc(requestRef, {
          from: me.uid,
          fromName,
          track,
          status: "pending",
          createdAt: new Date(),
        });

        // 3. Get recipient’s push token
        const userDoc = await getDoc(doc(db, "users", userId));
        const token = userDoc.data()?.expoPushToken;

        // 4. Send push notification
        if (token) {
          const res = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: token,
              title: `${fromName} sent you a dedication!`,
              body: `Track: ${track.name}`,
              data: {
                fromUid: me.uid,
                trackId: track.id,
              },
            }),
          });
          const resData = await res.json();
          console.log("Push response:", resData);
        }

        Alert.alert("Sent", `Dedication sent to ${username}`);
      } catch (err) {
        console.error("Dedicate Error:", err);
        Alert.alert("Error", "Failed to send dedication. Try again.");
            }
          }
        }
      ]
    );
  };

  const handleRemove = async (userId: string, username: string) => {
    Alert.alert(
      "Remove User",
      `Are you sure you want to remove ${username} from your connections?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(`Removing user: ${userId}`);
              setUsers(prev => prev.filter(user => user.id !== userId));
              Alert.alert("Success", `${username} has been removed from your connections.`);
            } catch (error) {
              Alert.alert("Error", "Failed to remove user. Please try again.");
            }
          }
        }
      ]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setUsers([]);
    setError(null);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: item.profilePic && item.profilePic.trim() !== ''
              ? item.profilePic
              : 'https://via.placeholder.com/60x60/333/fff?text=User'
          }}
          style={styles.profileImage}
          onError={() => console.log("Image load error for:", item.profilePic)}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.currentVibe}>
            {item.currentVibe && item.currentVibe.trim() !== ''
              ? item.currentVibe
              : "No vibe set"}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.dedicateButton}
          onPress={() => handleDedicate(item.id, item.username)}
        >
          <Text style={styles.dedicateText}>Dedicate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.id, item.username)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IonIcon name="search" size={20} color={Colors.ionIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username or user ID..."
            placeholderTextColor={Colors.ionIcon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchUsers}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <IonIcon name="close-circle" size={20} color={Colors.ionIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.loading} />
          <Text style={styles.loadingText}>Searching users...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <IonIcon name="alert-circle-outline" size={24} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={searchUsers}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {users.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && searchQuery.length > 0 ? (
            <View style={styles.emptyContainer}>
              <IonIcon name="people-outline" size={48} color={Colors.ionIcon} />
              <Text style={styles.noResults}>No users found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          ) : searchQuery.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IonIcon name="search-outline" size={48} color={Colors.ionIcon} />
              <Text style={styles.noResults}>Start searching</Text>
              <Text style={styles.noResultsSubtext}>
                Enter a username or user ID to find users
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Connect;