import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseconfig"; // adjust path
import { useNavigation } from "@react-navigation/native";

export default function MessagesScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Get current user document
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          const friendIds = userDoc.data().friends || [];

          if (friendIds.length > 0) {
            // Fetch all friends info
            const q = query(collection(db, "users"), where("__name__", "in", friendIds));
            const querySnapshot = await getDocs(q);

            const friendsData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setFriends(friendsData);
          }
        }
      } catch (error) {
        console.error("Error fetching friends: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Friends</Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ChatScreen", { friendId: item.id, friendName: item.name })}
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: "gray" }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
