import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const NotificationScreen = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const me = auth.currentUser;

  useEffect(() => {
    if (!me) return;

    const requestRef = collection(db, 'users', me.uid, 'friendRequests');
    const unsubscribe = onSnapshot(requestRef, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as { status: string }) }))
        .filter((item) => item.status === 'pending');
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResponse = async (item: any, response: 'accepted' | 'rejected') => {
    try {
      if (!me?.uid) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }
  
      // Update the friend request status
      const requestRef = doc(db, 'users', me.uid, 'friendRequests', item.id);
      await updateDoc(requestRef, { status: response });
  
      if (response === 'accepted') {
        // Save friendship for the current user
        await setDoc(doc(db, 'users', me.uid, 'friends', item.id), {
          uid: item.id,
          name: item.fromName,
          createdAt: new Date().toISOString(),
        });
  
        // Save friendship for the sender
        await setDoc(doc(db, 'users', item.id, 'friends', me.uid), {
          uid: me.uid,
          name: me.displayName || 'Unknown',
          createdAt: new Date().toISOString(),
        });
      }
  
      Alert.alert('Success', `Request ${response}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No new dedications right now 🎧</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.fromName} sent you a song!</Text>
          <Text style={styles.track}>🎵 {item.track?.name || 'Unknown Track'}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => handleResponse(item, 'accepted')}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#dc3545' }]}
              onPress={() => handleResponse(item, 'rejected')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  track: {
    fontSize: 14,
    marginVertical: 6,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default NotificationScreen;
