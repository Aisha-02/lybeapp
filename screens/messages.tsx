// MessagesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseconfig"; // adjust path
import { useNavigation } from "@react-navigation/native";

interface FriendType {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  vibe?: string;
  online?: boolean; // can be used for online status
}

export default function MessagesScreen() {
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const friendsRef = collection(db, "users", userId, "friends");
        const friendsSnap = await getDocs(friendsRef);
        const friendUIDs = friendsSnap.docs.map((doc) => doc.data().uid);

        const finalFriendList: FriendType[] = [];

        for (const fid of friendUIDs) {
          const userDoc = await getDoc(doc(db, "users", fid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const prefDoc = await getDoc(doc(db, "user_preferences", fid));
          const prefData = prefDoc.exists() ? prefDoc.data() : {};

          finalFriendList.push({
            id: fid,
            name: userData.username || "Unknown User",
            email: userData.email || "No email",
            profilePic: prefData.profilePic || null,
            vibe: prefData.vibe || "",
            online: Math.random() > 0.5, // placeholder online status
          });
        }

        setFriends(finalFriendList);
      } catch (e) {
        console.log("Error fetching friends:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#4e8cff" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ fontSize: 18, color: "#555" }}>
          No friends found 😢
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", paddingTop: 10 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 15,
          paddingHorizontal: 20,
          color: "#222",
        }}
      >
        Friends
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatScreen", {
                friendId: item.id,
                friendName: item.name,
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              marginBottom: 12,
              backgroundColor: "#fff",
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            {/* Avatar */}
            <View style={{ position: "relative" }}>
              <Image
                source={{
                  uri:
                    item.profilePic ||
                    "https://via.placeholder.com/150/CCCCCC/000000?text=DP",
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
              />
              {/* Online Indicator */}
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: item.online ? "#4CD964" : "#bbb",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
            </View>

            {/* Friend Info */}
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#222",
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginTop: 2,
                  maxWidth: "95%",
                }}
                numberOfLines={1}
              >
                {item.vibe || "No vibe set"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#999",
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {item.email}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
